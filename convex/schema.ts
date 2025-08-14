// data table for all the data and shit

import { timeStamp } from "console";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema ({
    userFlights : defineTable({
        userId: v.string(),
        flightNumber: v.string(),
        date: v.string(), 
        delayThreshold: v.number(),
        isActive: v.boolean(),
        createdAt: v.number()
    }),
    flights: defineTable({
        flightNumber: v.string(), 
        status: v.string(), 
        delay: v.optional(v.number()),
        timestamp: v.number()
    }),




});