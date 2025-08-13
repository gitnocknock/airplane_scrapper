/*
For user flight subscriptions
 */
import { query } from "./_generated/server";
import { v } from "convex/values";




export const getUserFlights = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userFlights")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();
    }
});


