/*
convex/flights.ts - For OpenSky flight data:

Store flight data from OpenSky API
Track flight positions/status changes
Query flights by route/region */


// convex/flights.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getFlightStatus = mutation({
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


export const getUserFlights = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userFlights")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();
    }
});