import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/agent-update",
  method: "POST", 
  handler: httpAction(async (ctx, request) => {
    const { flightNumber, status, delay, timestamp } = await request.json();
    
    await ctx.runMutation(api.flights.updateFlightStatus, {
      flightNumber,
      status, 
      delay,
      timestamp
    });
    
    return new Response("OK");
  })
});

export default http;