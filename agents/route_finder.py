import os
import requests
from flask import Flask, request, jsonify
import json
from datetime import datetime, timedelta

app = Flask(__name__)

FETCH_AI_API_KEY = os.getenv('FETCH_AI_API_KEY')
CONVEX_DEPLOYMENT_URL = os.getenv('CONVEX_DEPLOYMENT_URL')  
AERO_DATA_API_KEY = os.getenv('AERO_DATA_API_KEY') 

ASI_ONE_ENDPOINT = "https://api.asi1.ai/v1/chat/completions"
MODEL_NAME = "asi1-mini"

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

def store_routes_in_convex(user_id, flight_number, date, routes):
    """Store alternative routes in Convex database"""
    try:
        convex_response = requests.post(
            f"{CONVEX_DEPLOYMENT_URL}/api/mutations",
            headers={"Content-Type": "application/json"},
            json={
                "path": "routes:storeAlternativeRoutes",
                "args": {
                    "userId": user_id,
                    "originalFlightNumber": flight_number,
                    "disruptionDate": date,
                    "routes": routes
                }
            },
            timeout=10
        )
        
        if convex_response.status_code == 200:
            return True 
        else:
            print(f"Convex error: {convex_response.text}")
            return False
            
    except Exception as e:
        print(f"Convex storage error: {str(e)}")
        return False

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
    
    # Step 1: Get real flight data from AeroDataBox
    print(f"Fetching flights from {origin} to {destination}...")
    real_flights = get_real_flights(origin, destination, date)
    
    if not real_flights:
        print("No real flights found, using AI-generated data as fallback")
        flight_data_context = "No real flight data available. Generate realistic alternatives."
    else:
        flight_data_context = f"Here are real available flights: {json.dumps(real_flights, indent=2)}"
    
    # Step 2: Create AI prompt with real data
    prompt = f"""
You are an intelligent travel agent powered by ASI:One. The passenger's flight {flight_number} from {origin} to {destination} on {date} has been disrupted.

Here is real-time flight data:
{flight_data_context}

Your task:
1. Use real flights whenever possible
2. If none meet criteria, generate plausible alternatives
3. Max 2 layovers
4. Time flexibility: ±4 hours
5. Avoid {flight_number}
6. Prefer airlines like AA, DL, UA, BA, EK, QR, etc.
7. Minimize connection times (< 2h domestic, < 3h international)

Return valid JSON with:
- route_id
- flights: list with flight, from, to, departure, arrival
- total_duration (e.g., "7h 45m")
- reasoning: concise explanation

Output format:
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
        # Call ASI:One AI
        response = requests.post(
            ASI_ONE_ENDPOINT,
            headers={
                "Authorization": f"Bearer {FETCH_AI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL_NAME,
                "messages": [
                    {"role": "system", "content": "You are a helpful travel routing agent with access to real flight data."},
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
            
            convex_success = False
            if user_id:
                convex_success = store_routes_in_convex(user_id, flight_number, date, routes)
            
            return jsonify({
                "routes": routes,
                "stored_in_db": bool(user_id and convex_success),
                "used_real_data": len(real_flights) > 0,
                "real_flights_found": len(real_flights)
            })
        else:
            return jsonify({
                "error": "Failed to get response from ASI:One",
                "details": response.text
            }), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/assign-flight', methods=['POST'])
def handle_flight_assignment():
    data = request.json
    flight_number = data.get('flightNumber')
    user_id = data.get('userId')
    
    return jsonify({
        "status": "assigned",
        "userId": user_id,
        "assignedFlight": flight_number
    })

@app.route('/get-user-routes/<user_id>', methods=['GET'])
def get_user_routes(user_id):
    """Get all alternative routes for a user"""
    try:
        convex_response = requests.post(
            f"{CONVEX_DEPLOYMENT_URL}/api/queries",
            headers={"Content-Type": "application/json"},
            json={
                "path": "routes:getUserRoutes", 
                "args": {"userId": user_id}
            },
            timeout=10
        )
        
        if convex_response.status_code == 200:
            routes = convex_response.json()
            return jsonify({"routes": routes})
        else:
            return jsonify({"error": "Failed to fetch routes"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)