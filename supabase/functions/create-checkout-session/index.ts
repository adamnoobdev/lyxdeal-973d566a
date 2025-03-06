
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dealId } = await req.json();
    console.log('Processing checkout for deal:', dealId);

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
      // Generate a discount code directly here
      const code = generateRandomCode(8);
      
      // Create a purchase record
      const { data: purchase, error: purchaseError } = await supabaseAdmin
        .from('purchases')
        .insert({
          deal_id: dealId,
          customer_email: 'free_deal@example.com', // This will be updated in the UI when user claims
          discount_code: code,
          status: 'completed'
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Error creating purchase:', purchaseError);
        return new Response(
          JSON.stringify({ error: 'Failed to create purchase record' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }

      // Create a discount code record
      const { error: discountError } = await supabaseAdmin
        .from('discount_codes')
        .insert({
          deal_id: dealId,
          code: code,
          purchase_id: purchase.id
        });

      if (discountError) {
        console.error('Error creating discount code:', discountError);
        return new Response(
          JSON.stringify({ error: 'Failed to create discount code' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }

      // Update deal quantity
      const { error: updateError } = await supabaseAdmin.rpc('decrease_quantity', {
        price_id: deal.stripe_price_id || 'free_deal'
      });

      if (updateError) {
        console.error('Error updating quantity:', updateError);
      }

      // Return the free deal response with the code
      return new Response(
        JSON.stringify({ 
          free: true, 
          code: code,
          redirect_url: `${req.headers.get('origin')}/success?deal_id=${dealId}&code=${code}`
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
      cancel_url: `${req.headers.get('origin')}/product/${dealId}`,
      client_reference_id: dealId.toString(),
      custom_text: {
        submit: {
          message: 'Vi kommer skicka din rabattkod via email efter betalningen är genomförd.',
        },
      },
      custom_fields: [
        {
          key: 'marketing_consent',
          label: {
            type: 'custom',
            custom: 'Jag godkänner att ta emot erbjudanden via email',
          },
          type: 'text',
          optional: true,
        },
      ],
      payment_intent_data: {
        description: deal.title,
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

// Helper function to generate random codes
function generateRandomCode(length = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
