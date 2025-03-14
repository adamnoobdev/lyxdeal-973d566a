
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

serve(async (req) => {
  try {
    console.log("Webhook received but no longer processing Stripe payments");
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: err.message }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
