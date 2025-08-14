/*
For user flight subscriptions
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addUserFlight = mutation({
    args: {userId: v.string(), flightNumber: v.string(), date: v.string(), delayThreshold: v.number()},
    handler: async (ctx, args) => {
        await ctx.db
            .insert("userFlights", {
                userId: args.userId,
                flightNumber: args.flightNumber,
                date: args.date,
                delayThreshold: args.delayThreshold,
                isActive: true,
                createdAt: Date.now()
            });
    }
});

export const getUserFlightPreferences = query({
    args: { userId: v.string() },  
    handler: async (ctx, args) => {  
        const userFlights = await ctx.db
            .query("userFlights")  
            .filter(q => q.eq(q.field("userId"), args.userId))  
            .collect();
        
        if (userFlights.length === 0) {
            return null;
        }
        
        const avgDelayThreshold = userFlights.reduce((sum, flight) => sum + flight.delayThreshold, 0) / userFlights.length;
        
        return {
            userId: args.userId,
            averageDelayThreshold: avgDelayThreshold,
            totalTrackedFlights: userFlights.length,
            activeFlights: userFlights.filter(f => f.isActive).length
        };
    }
});

export const removeUserFlight = mutation({
    args: { userId: v.string(), flightNumber: v.string() },
    handler: async(ctx, args) => {  
        const userFlight = await ctx.db
            .query("userFlights")  
            .filter(q => q.and(
                q.eq(q.field("userId"), args.userId),
                q.eq(q.field("flightNumber"), args.flightNumber)
            ))
            .first();
        
        if (userFlight) {
            await ctx.db.delete(userFlight._id);  
        }
    }
});

export const getUserFlights = query({
    args: { userId: v.string()},
    handler: async(ctx, args) => {
        return await ctx.db
        .query("userFlights")
        .filter(q => q.and(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("isActive"), true)
        ))
        .collect();  
    },
});

export const updateFlightPreferences = mutation({
    args: { 
        userId: v.string(), 
        flightNumber: v.string(), 
        delayThreshold: v.number() 
    },
    handler: async (ctx, args) => {
        const userFlight = await ctx.db
            .query("userFlights")
            .filter(q => q.and(
                q.eq(q.field("userId"), args.userId),
                q.eq(q.field("flightNumber"), args.flightNumber)
            ))
            .first();
            
        if (userFlight) {
            await ctx.db.patch(userFlight._id, {
                delayThreshold: args.delayThreshold
            });
        }
    }
});