/*
agents to send data back 
*/

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";


const http = httpRouter();

http.route({
  path: "/agent-update",
  method: "POST", 
  handler: httpAction(async (ctx, request) => {
    const { flightNumber, status, delay } = await request.json();
    
    // Update flight status in database
    await ctx.runMutation(api.flights.updateFlightStatus, {
      flightNumber,
      status, 
      delay
    });
    
    return new Response("OK");
  })
});

export default http;