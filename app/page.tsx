"use client";
import { useState } from 'react';

export default function Home() {
  const [agents, setAgents] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [flightNumber, setFlightNumber] = useState('');
  const [agentName, setAgentName] = useState('');

  const handleDeployAgent = () => {
    if (flightNumber.trim() && agentName.trim()) {
      const newAgent = {
        id: `Agent-${String(agents.length + 1).padStart(3, '0')}`,
        name: agentName.trim(),
        flight: flightNumber.trim().toUpperCase()
      };

      setAgents([...agents, newAgent]);

      setFlightNumber('');
      setAgentName('');
      setShowModal(false);
      
      // TODO: Call your Convex function here
      // await assignFlightToAgent({ flightNumber: newAgent.flight, userId: 'current-user' });
    }
  };

  return (
    <main>
      <div className="bg-cyan-950 h-20 flex justify-between items-center px-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Flight Guard AI
        </h1>
      </div>

      <div className="bg-blue-950 border-2 border-black h-max flex flex-col gap-6 p-6 items-center justify-center">
        <div className="bg-cyan-950/80 rounded-lg h-32 w-96 p-5 border border-cyan-500/30 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-3xl font-bold text-cyan-400">{agents.length.toString().padStart(2, '0')}</p>
            <p className="text-gray-300">Active Agents</p>
          </div>
        </div>

        <div className="bg-cyan-950/80 rounded-lg h-32 w-96 p-5 border border-blue-500/30 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-3xl font-bold text-blue-400">{agents.length.toString().padStart(2, '0')}</p>
            <p className="text-gray-300">Flights Monitored</p>
          </div>
        </div>

        <div className="bg-cyan-950/80 rounded-lg h-32 w-96 p-5 border border-red-500/30 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-3xl font-bold text-red-400">00</p>
            <p className="text-gray-300">Active Disruptions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 h-screen">
        
        <div className="bg-gray-800 w-full h-full border-r border-gray-700">
          <div className="flex justify-between items-center p-6">
            <h1 className="text-cyan-400 text-2xl font-bold">AI Agents</h1>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-cyan-400 hover:bg-cyan-500 w-32 h-12 rounded-lg font-bold text-white text-lg flex items-center justify-center transition-colors duration-200"
            >
              Deploy New
            </button>
          </div>
          
          <div className="flex flex-col gap-4 px-6">
            {agents.length === 0 ? (
              <div className="text-gray-400 text-center py-12">
                No agents deployed yet.<br />
                Click "Deploy New" to create your first agent.
              </div>
            ) : (
              agents.map((agent) => (
                <div key={agent.id} className="bg-gray-700 w-full h-32 rounded-lg border border-gray-600 text-white font-bold flex flex-col items-center justify-center">
                  <div className="text-lg">{agent.name}</div>
                  <div className="text-sm text-green-300 font-normal">Monitoring: {agent.flight}</div>
                  <div className="text-xs text-gray-400 font-normal">{agent.id}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-900 w-full h-full">
          <div className="grid grid-rows-2 gap-5 place-items-center p-5 h-full">
            <div className="bg-cyan-950/50 h-full w-full max-w-2xl rounded-lg border border-gray-700">
              <h1 className="text-white text-2xl font-bold text-center p-4">Live Flight Map</h1>
            </div>
            <div className="bg-cyan-950/50 h-full w-full max-w-2xl rounded-lg border border-gray-700">
              <h1 className="text-white text-2xl font-bold text-center p-4">Agent Activity Feed</h1>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 w-full h-full border-l border-gray-700">
          <div className="p-6">
            <h1 className="text-cyan-400 text-2xl font-bold mb-6">Smart Insights</h1>
            
            <div className="grid grid-rows-3 gap-4 place-items-center">
              <div className="bg-gray-700 w-48 h-32 rounded-lg border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center">
                Flight Analytics
              </div>
              <div className="bg-gray-700 w-48 h-32 rounded-lg border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center">
                Route Optimization
              </div>
              <div className="bg-gray-700 w-48 h-32 rounded-lg border border-purple-500/30 text-purple-400 font-bold flex items-center justify-center">
                Disruption Alerts
              </div>
            </div>
          </div>
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-96">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Deploy New Agent</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Enter agent name"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Flight Number</label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="e.g. AA1234"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFlightNumber('');
                  setAgentName('');
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeployAgent}
                disabled={!flightNumber.trim() || !agentName.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Deploy Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


/*
This seems very static first thing tmrw get rid of the place holder stuff and focus on
interactivity of the website.
Do Flight map for last and focus on:
If user clicks on deploy -> Creates Agent -> Allow user to find alternative ->
create box and make it look good -> show that on the active live map 
 - call convex to the front end for deploy agent
 - understand the code as well
 - Check if it is an actual flight and if it isn't throw an error
*/