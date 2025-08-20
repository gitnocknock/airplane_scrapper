// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    userFlights: defineTable({
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

    alternativeRoutes: defineTable({
        userId: v.string(),
        originalFlightNumber: v.string(),
        disruptionDate: v.string(),
        routes: v.array(v.object({
            route_id: v.number(),
            flights: v.array(v.object({
                flight: v.string(),
                from: v.string(),
                to: v.string(),
                departure: v.string(),
                arrival: v.string()
            })),
            total_duration: v.string(),
            reasoning: v.string()
        })),
        createdAt: v.number(),
        isActive: v.boolean()
    })
});