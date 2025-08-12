/*
convex/agents.ts - For AI agent management:

Deploy agents to monitor specific flights/routes
Update agent status and assigned flights
Track which agents are monitoring which OpenSky flight IDs 
*/

import { mutation } from './_generated/server'
import { v } from "convex/values";


// This sends flight assignments to your Python agents
export const assignFlightToAgent = mutation({
  args: { flightNumber: v.string(), userId: v.string() },
  handler: async (ctx, { flightNumber, userId }) => {
    // Store in database
    await ctx.db.insert("userFlights", { flightNumber, userId });
    
    // Send HTTP request to Python agent
    await fetch("http://localhost:8000/assign-flight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flightNumber, userId })
    });
  }
});

// USED TO PING THE AI AGENT