import os
import requests
from flask import Flask, request, jsonify
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows requests from any origin


# Load environment variables
load_dotenv()

app = Flask(__name__)

# API keys and endpoints
FETCH_AI_API_KEY = os.getenv('FETCH_AI_API_KEY')
CONVEX_DEPLOYMENT_URL = os.getenv('CONVEX_DEPLOYMENT_URL')  
AERO_DATA_API_KEY = os.getenv('AERO_DATA_API_KEY')

ASI_ONE_ENDPOINT = "https://api.asi1.ai/v1/chat/completions"
MODEL_NAME = "asi1-mini"

# Store active flight monitors
active_monitors = {}

class FlightMonitor:
    def __init__(self, flight_number, user_id):
        self.flight_number = flight_number
        self.user_id = user_id
        self.is_active = True
        
    def get_flight_status(self):
        """Get flight status from AeroDataBox API"""
        try:
            today = datetime.now().strftime('%Y-%m-%d')
            url = f"https://aerodatabox.p.rapidapi.com/flights/number/{self.flight_number}"
            
            headers = {
                'X-RapidAPI-Key': AERO_DATA_API_KEY,
                'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
            }
            
            params = {'date': today}
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            if response.status_code == 200:
                flight_data = response.json()
                if flight_data and len(flight_data) > 0:
                    flight = flight_data[0]
                    departure = flight.get('departure', {})
                    
                    # Calculate delay
                    delay_minutes = 0
                    status = "scheduled"
                    
                    if departure.get('actualTimeLocal') and departure.get('scheduledTimeLocal'):
                        scheduled = datetime.fromisoformat(departure['scheduledTimeLocal'].replace('Z', '+00:00'))
                        actual = datetime.fromisoformat(departure['actualTimeLocal'].replace('Z', '+00:00'))
                        delay_minutes = max(0, int((actual - scheduled).total_seconds() / 60))
                        
                        if delay_minutes > 15:
                            status = "delayed"
                        else:
                            status = "on_time"
                    
                    return {
                        "flightNumber": self.flight_number,
                        "status": status,
                        "delay": delay_minutes,
                        "timestamp": int(datetime.now().timestamp() * 1000)
                    }
            return None
        except Exception as e:
            print(f"Error getting flight status: {e}")
            return None
    
    def monitor_flight(self):
        """Monitor flight and send updates to Convex"""
        print(f"Starting to monitor flight {self.flight_number}")
        
        while self.is_active:
            try:
                flight_data = self.get_flight_status()
                
                if flight_data:
                    # Send to Convex webhook
                    webhook_url = f"{CONVEX_DEPLOYMENT_URL}/agent-update"
                    requests.post(webhook_url, json=flight_data, timeout=10)
                    print(f"Updated {self.flight_number}: {flight_data['status']}")
                
                # Wait 5 minutes before next check
                import time
                time.sleep(300)
                
            except Exception as e:
                print(f"Error in monitoring loop: {e}")
                import time
                time.sleep(60)
    
    def stop(self):
        self.is_active = False

def get_real_flights(origin_iata, destination_iata, date):
    """Fetch departing flights from origin and filter by destination"""
    try:
        url = f"https://aerodatabox.p.rapidapi.com/flights/departures/{origin_iata}/{date}"
        
        headers = {
            "X-RapidAPI-Key": AERO_DATA_API_KEY,
            "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com"
        }
        
        params = {
            "withLegs": "true",
            "withCodeshared": "true",
            "withCargo": "false",
            "max": "100"
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=10)

        if response.status_code == 200:
            flights_data = response.json()
            relevant_flights = []

            for flight in flights_data.get("flights", []):
                legs = flight.get("legs", [])
                if not legs:
                    continue

                last_leg = legs[-1]
                if last_leg.get("destination", {}).get("iata") == destination_iata:
                    relevant_flights.append({
                        "flight_number": legs[0].get("number", "N/A"),
                        "airline": flight.get("airline", {}).get("name", "Unknown"),
                        "departure_time": legs[0].get("departure", {}).get("scheduledTimeLocal", "N/A"),
                        "arrival_time": last_leg.get("arrival", {}).get("scheduledTimeLocal", "N/A"),
                        "aircraft": last_leg.get("aircraft", {}).get("model", "N/A"),
                        "stops": len(legs) - 1
                    })

            return relevant_flights[:10]
        else:
            print(f"AeroDataBox API error: {response.status_code} - {response.text}")
            return []

    except Exception as e:
        print(f"Error fetching real flights: {str(e)}")
        return []

@app.route('/assign-flight', methods=['POST'])
def handle_flight_assignment():
    data = request.json
    flight_number = data.get('flightNumber')
    user_id = data.get('userId')
    
    if not flight_number or not user_id:
        return jsonify({"error": "Missing flightNumber or userId"}), 400
    
    # Create and start flight monitor
    monitor = FlightMonitor(flight_number, user_id)
    monitor_key = f"{flight_number}_{user_id}"
    active_monitors[monitor_key] = monitor
    
    # Start monitoring in background thread
    import threading
    monitor_thread = threading.Thread(target=monitor.monitor_flight)
    monitor_thread.daemon = True
    monitor_thread.start()
    
    return jsonify({
        "status": "assigned",
        "message": f"Now monitoring {flight_number}",
        "userId": user_id,
        "assignedFlight": flight_number
    })

@app.route('/find-alternative-routes', methods=['POST'])
def find_alternative_routes():
    data = request.json
    origin = data.get('origin')  
    destination = data.get('destination')  
    flight_number = data.get('flightNumber')
    date = data.get('date')
    user_id = data.get('userId')
    
    if not all([origin, destination, date, flight_number]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Get real flight data from AeroDataBox
    print(f"Fetching flights from {origin} to {destination}...")
    real_flights = get_real_flights(origin, destination, date)
    
    if not real_flights:
        flight_data_context = "No real flight data available. Generate realistic alternatives."
    else:
        flight_data_context = f"Here are real available flights: {json.dumps(real_flights, indent=2)}"
    
    prompt = f"""
You are an intelligent travel agent. The passenger's flight {flight_number} from {origin} to {destination} on {date} has been disrupted.

{flight_data_context}

Find alternative flights with:
1. Real flights preferred
2. Max 2 layovers
3. Time flexibility: ±4 hours
4. Avoid {flight_number}
5. Prefer major airlines

Return valid JSON:
[
  {{
    "route_id": 1,
    "flights": [
      {{"flight": "AA100", "from": "JFK", "to": "ATL", "departure": "2025-06-10T08:00", "arrival": "2025-06-10T10:30"}}
    ],
    "total_duration": "8h 30m",
    "reasoning": "Shortest travel time with reliable carrier."
  }}
]
"""

    try:
        response = requests.post(
            ASI_ONE_ENDPOINT,
            headers={
                "Authorization": f"Bearer {FETCH_AI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL_NAME,
                "messages": [
                    {"role": "system", "content": "You are a helpful travel routing agent."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.4,
                "max_tokens": 1500,
                "response_format": {"type": "json_object"}
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            routes_text = result["choices"][0]["message"]["content"]
            routes = json.loads(routes_text)
            
            return jsonify({
                "routes": routes,
                "used_real_data": len(real_flights) > 0,
                "real_flights_found": len(real_flights)
            })
        else:
            return jsonify({
                "error": "Failed to get response from AI",
                "details": response.text
            }), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify({
        "active_monitors": len(active_monitors),
        "monitored_flights": list(active_monitors.keys()),
        "server_status": "running"
    })

if __name__ == '__main__':
    print("Starting Flight Guard AI Agent...")
    print(f"API Keys configured:")
    print(f"  Fetch AI: {'yes' if FETCH_AI_API_KEY else 'nah fam'}")
    print(f"  AeroData: {'yes' if AERO_DATA_API_KEY else 'nah fam'}")
    print(f"  Convex URL: {'yes' if CONVEX_DEPLOYMENT_URL else 'nah fam'}")
    
    app.run(port=5071, debug=True)