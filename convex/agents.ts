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
    await ctx.runMutation(api.agents.assignFlightToAgent, {
      flightNumber,
      userId,
      delayThreshold: 15, 
      date: new Date().toISOString().split('T')[0]
    });
    
    // Then send HTTP request to Python agent
    await fetch("https://49eb21ed8d28.ngrok-free.app/assign-flight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flightNumber, userId })
    });
  }
});