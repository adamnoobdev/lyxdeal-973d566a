
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Stripe } from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dealId, customerInfo } = await req.json();
    console.log('Processing checkout for deal:', dealId, 'Customer:', customerInfo);

    if (!dealId) {
      console.error('No deal ID provided');
      return new Response(
        JSON.stringify({ error: 'No deal ID provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const { data: deal, error: dealError } = await supabaseAdmin
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .single();

    if (dealError) {
      console.error('Error fetching deal:', dealError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch deal information' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    if (!deal) {
      console.error('Deal not found:', dealId);
      return new Response(
        JSON.stringify({ error: 'Deal not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    if (deal.quantity_left <= 0) {
      console.error('Deal is sold out:', dealId);
      return new Response(
        JSON.stringify({ error: 'This deal is sold out' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Handle free deals
    if (deal.is_free || deal.discounted_price === 0) {
      // Find an available discount code
      const { data: discountCode, error: codeError } = await supabaseAdmin
        .from('discount_codes')
        .select('*')
        .eq('deal_id', dealId)
        .is('customer_email', null)
        .limit(1)
        .single();

      if (codeError || !discountCode) {
        console.error('Error fetching discount code:', codeError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch discount code' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }

      // Update the discount code with customer information
      const { error: updateError } = await supabaseAdmin
        .from('discount_codes')
        .update({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone || null
        })
        .eq('id', discountCode.id);

      if (updateError) {
        console.error('Error updating discount code:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update discount code' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }

      // Decrease quantity
      const { error: decreaseError } = await supabaseAdmin.rpc('decrease_quantity', {
        price_id: 'free_deal'
      });

      if (decreaseError) {
        console.error('Error decreasing quantity:', decreaseError);
      }

      return new Response(
        JSON.stringify({ 
          free: true, 
          code: discountCode.code 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // For paid deals, proceed with Stripe checkout
    if (!deal.stripe_price_id) {
      console.error('No Stripe price ID found for deal:', dealId);
      return new Response(
        JSON.stringify({ error: 'No Stripe price ID found for this deal' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Missing Stripe configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log('Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: deal.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?deal_id=${dealId}`,
      cancel_url: `${req.headers.get('origin')}/deal/${dealId}`,
      client_reference_id: dealId.toString(),
      customer_email: customerInfo.email,
      custom_text: {
        submit: {
          message: 'Vi kommer skicka din rabattkod via email efter betalningen är genomförd.',
        },
      },
      payment_intent_data: {
        description: deal.title,
        metadata: {
          deal_id: dealId.toString(),
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone || ''
        }
      },
    });

    if (!session?.url) {
      console.error('Failed to create checkout session URL');
      return new Response(
        JSON.stringify({ error: 'Failed to create checkout session' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    console.log('Checkout session created successfully:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in checkout process:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
