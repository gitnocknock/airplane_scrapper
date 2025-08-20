// convex/routes.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const storeAlternativeRoutes = mutation({
  args: { 
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
    }))
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alternativeRoutes", {
      userId: args.userId,
      originalFlightNumber: args.originalFlightNumber,
      disruptionDate: args.disruptionDate,
      routes: args.routes,
      createdAt: Date.now(),
      isActive: true
    });
  }
});

export const getUserRoutes = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("alternativeRoutes")
      .filter(q => q.and(
        q.eq(q.field("userId"), args.userId),
        q.eq(q.field("isActive"), true)
      ))
      .order("desc")
      .collect();
  }
});

export const getRoutesByFlight = query({
  args: { flightNumber: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("alternativeRoutes")
      .filter(q => q.and(
        q.eq(q.field("originalFlightNumber"), args.flightNumber),
        q.eq(q.field("userId"), args.userId),
        q.eq(q.field("isActive"), true)
      ))
      .first();
  }
});