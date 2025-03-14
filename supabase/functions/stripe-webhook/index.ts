
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

const generateRandomCode = (length = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Get line items to find the price ID
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;

      if (!priceId) {
        throw new Error('No price ID found in session');
      }

      // Initialize Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Find the deal based on stripe_price_id
      const { data: deals, error: dealError } = await supabaseClient
        .from('deals')
        .select('id, is_free')
        .eq('stripe_price_id', priceId)
        .single();

      if (dealError || !deals) {
        console.error('Error finding deal:', dealError);
        throw new Error('Could not find deal');
      }

      // Create a purchase record
      const { data: purchase, error: purchaseError } = await supabaseClient
        .from('purchases')
        .insert({
          deal_id: deals.id,
          customer_email: session.customer_details?.email || '',
          discount_code: generateRandomCode(),
          status: 'completed',
          price_paid: deals.is_free ? 0 : null // Set price_paid to 0 for free deals
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Error creating purchase:', purchaseError);
        throw purchaseError;
      }

      // Create a discount code record
      const { error: discountError } = await supabaseClient
        .from('discount_codes')
        .insert({
          deal_id: deals.id,
          code: purchase.discount_code,
          purchase_id: purchase.id
        });

      if (discountError) {
        console.error('Error creating discount code:', discountError);
        throw discountError;
      }

      // Update deal quantity
      const { error: updateError } = await supabaseClient.rpc('decrease_quantity', {
        price_id: priceId
      });

      if (updateError) {
        console.error('Error updating quantity:', updateError);
        throw updateError;
      }

      console.log('Successfully processed payment and created discount code');
    }

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
