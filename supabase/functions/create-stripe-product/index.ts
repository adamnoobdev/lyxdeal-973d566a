import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, handleCors } from "../_shared/cors.ts"
import Stripe from "stripe";

const stripe = new Stripe("your_stripe_secret_key", {
  apiVersion: "2020-08-27",
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { name, description, images, price } = await req.json();

    const product = await stripe.products.create({
      name,
      description,
      images,
    });

    await stripe.prices.create({
      product: product.id,
      unit_amount: price,
      currency: "usd",
    });

    return new Response(JSON.stringify(product), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}

serve(handler)
