/*
convex/agents.ts - For AI agent management:

Deploy agents to monitor specific flights/routes
Update agent status and assigned flights
Track which agents are monitoring which OpenSky flight IDs 
*/

import { mutation, action } from './_generated/server'
import { v } from "convex/values";
import { api } from "./_generated/api";

export const assignFlightToAgent = mutation({
  args: { 
    flightNumber: v.string(), 
    userId: v.string(),
    delayThreshold: v.number(),
    date: v.string()
  },
  handler: async (ctx, { flightNumber, userId, delayThreshold, date }) => {
    await ctx.db.insert("userFlights", { 
      flightNumber, 
      userId,
      date,
      delayThreshold,
      isActive: true,
      createdAt: Date.now()
    });
  }
});

export const notifyPythonAgent = action({
  args: { flightNumber: v.string(), userId: v.string() },
  handler: async (ctx, { flightNumber, userId }) => {
    // First store in database
    await ctx.runMutation(api.agents.assignFlightToAgent, {
      flightNumber,
      userId,
      delayThreshold: 15, 
      date: new Date().toISOString().split('T')[0]
    });
    
    // Your Railway deployment URL
    const PYTHON_AGENT_URL = "airplanescrapper-airplae-stuff.up.railway.app";
    
    try {
      const response = await fetch(`${PYTHON_AGENT_URL}/assign-flight`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add ngrok bypass header if needed
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ flightNumber, userId })
      });
      
      if (!response.ok) {
        throw new Error(`Python agent responded with status: ${response.status}`);
      }
      
      console.log("Successfully notified Python agent");
      return { success: true, message: "Agent deployed successfully" };
      
    } catch (error) {
      console.error("Failed to notify Python agent:", error);
      // Don't throw - we already saved to database
      return { success: false, message: "Agent saved but notification failed" };
    }
  }
});