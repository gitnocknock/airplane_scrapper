/*
convex/disruptions.ts - For handling flight disruptions:

Log disruptions detected from OpenSky data
Store AI-generated backup routes
Track disruption resolution status 
*/

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logDisruptions = mutation({
    args: {flightNumber: v.string(), status: v.string(), timestamp: v.number()},
    handler: async (ctx, args) => {
        return ctx.db
        .insert("flights", {flightNumber: args.flightNumber, status: args.status, timestamp: args.timestamp})
    },

});

export const storeBackup = mutation({
    // add ai shit to this one to find a backup route
    args: {},
    handler: async(ctx, args) => {

    }
});
