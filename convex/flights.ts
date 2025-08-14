/*
convex/flights.ts - For OpenSky flight data:

Store flight data from OpenSky API
Track flight positions/status changes
Query flights by route/region */

import { time } from "console";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateFlightStatus = mutation({
  args: { 
    flightNumber: v.string(), 
    status: v.string(), 
    delay: v.optional(v.number()), 
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    const existingFlight = await ctx.db
      .query("flights")
      .filter(q => q.eq(q.field("flightNumber"), args.flightNumber))
      .first();
    
    if (existingFlight) {
      await ctx.db.patch(existingFlight._id, {
        status: args.status,
        delay: args.delay
      });
      return existingFlight._id;
    } else {
      return await ctx.db.insert("flights", {
        flightNumber: args.flightNumber,
        status: args.status,
        delay: args.delay,
        timestamp: args.timestamp
      });
    }
  },
});

export const getFlightStatus = query({
  args: { flightNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flights")
      .filter(q => q.eq(q.field("flightNumber"), args.flightNumber))
      .first();
  }
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