import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeKey || !supabaseUrl || !supabaseKey) {
      console.error('Missing required environment variables');
      throw new Error('Server configuration error');
    }

    // Parse request body
    const { dealId } = await req.json();
    console.log('Processing checkout for deal:', dealId);

    if (!dealId) {
      throw new Error('No deal ID provided');
    }

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Get deal information
    const { data: deal, error: dealError } = await supabaseAdmin
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .single();

    if (dealError) {
      console.error('Error fetching deal:', dealError);
      throw new Error('Failed to fetch deal information');
    }

    if (!deal) {
      console.error('Deal not found:', dealId);
      throw new Error('Deal not found');
    }

    if (!deal.stripe_price_id) {
      console.error('No Stripe price ID found for deal:', dealId);
      throw new Error('No Stripe price ID found for this deal');
    }

    if (deal.quantity_left <= 0) {
      console.error('Deal is sold out:', dealId);
      throw new Error('This deal is sold out');
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log('Creating checkout session for price:', deal.stripe_price_id);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: deal.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?deal_id=${dealId}`,
      cancel_url: `${req.headers.get('origin')}/product/${dealId}`,
      client_reference_id: dealId.toString(),
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    console.log('Checkout session created successfully:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in checkout process:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400,
      }
    );
  }
});