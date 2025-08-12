/*
convex/flights.ts - For OpenSky flight data:

Store flight data from OpenSky API
Track flight positions/status changes
Query flights by route/region */


// convex/flights.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateFlightStatus = mutation({
  args: { 
    flightNumber: v.string(), 
    status: v.string(), 
    delay: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    // Your update logic here
    // (We'll fill this in later)
  },
});