# agent_coordinator.py


# understand this shit and what it is trying to do
# Whats the difference between disruptions and the route finder?
# Add an API key for fetch AI and areoData box api 

from flask import Flask, request, jsonify
import request
import os



app = Flask(__name__)

@app.route('/assign-flight', methods=['POST'])
def handle_flight_assignment():
    # Get data from Convex
    data = request.json
    flight_number = data['flightNumber']
    user_id = data['userId']
    
    # Your logic here to:
    # 1. Create flight_agent for monitoring
    # 2. Store assignment info
    # 3. Start monitoring process
    
    return jsonify({"status": "assigned"})

if __name__ == '__main__':
    app.run(port=8000)