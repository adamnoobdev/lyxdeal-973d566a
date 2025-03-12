import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import type { SupabaseClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handleCheckoutSuccess = async (
  checkoutSession: Stripe.Checkout.Session, 
  supabaseAdmin: SupabaseClient, 
  paymentIntent: Stripe.PaymentIntent
) => {
  try {
    console.log('Processing successful checkout session:', checkoutSession.id);
    
    const dealId = checkoutSession.client_reference_id;
    if (!dealId) {
      throw new Error('No deal ID found in session reference');
    }

    // Extract customer info from metadata
    const metadata = paymentIntent.metadata || {};
    const customerName = metadata.customer_name;
    const customerEmail = checkoutSession.customer_email || metadata.customer_email;
    const customerPhone = metadata.customer_phone;

    if (!customerEmail) {
      throw new Error('No customer email found');
    }

    // Get an available discount code for this deal
    const { data: discountCode, error: codeError } = await supabaseAdmin
      .from('discount_codes')
      .select('*')
      .eq('deal_id', parseInt(dealId))
      .is('customer_email', null)
      .limit(1)
      .single();

    if (codeError || !discountCode) {
      throw new Error(`Failed to fetch discount code: ${codeError?.message || 'No codes available'}`);
    }

    // Update the discount code with customer information
    const { error: updateError } = await supabaseAdmin
      .from('discount_codes')
      .update({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null
      })
      .eq('id', discountCode.id);

    if (updateError) {
      throw new Error(`Failed to update discount code: ${updateError.message}`);
    }

    // Create a purchase record
    const { error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert({
        deal_id: parseInt(dealId),
        customer_email: customerEmail,
        discount_code: discountCode.code,
        status: 'completed'
      });

    if (purchaseError) {
      throw new Error(`Failed to create purchase record: ${purchaseError.message}`);
    }

    // Decrease quantity
    const priceId = checkoutSession.line_items?.data[0]?.price?.id || 'unknown';
    const { error: decreaseError } = await supabaseAdmin.rpc('decrease_quantity', {
      price_id: priceId
    });

    if (decreaseError) {
      console.error('Error decreasing quantity:', decreaseError);
    }

    console.log(`Successfully processed payment and assigned discount code ${discountCode.code} to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error handling checkout success:', error);
    return false;
  }
};

const handleEvent = async (
  event: Stripe.Event, 
  supabaseAdmin: SupabaseClient
): Promise<{ success: boolean, message: string }> => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session.id);
      
      // For payment_intent mode, get the payment intent to access metadata
      if (session.payment_intent && typeof session.payment_intent === 'string') {
        try {
          // Initialize Stripe
          const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
          if (!stripeKey) throw new Error('Missing Stripe secret key');
          
          const stripe = new Stripe(stripeKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
          });
          
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
          const success = await handleCheckoutSuccess(session, supabaseAdmin, paymentIntent);
          
          if (success) {
            return { success: true, message: 'Checkout session processed successfully' };
          } else {
            return { success: false, message: 'Failed to process checkout session' };
          }
        } catch (error) {
          console.error('Error processing payment intent:', error);
          return { success: false, message: `Error processing payment: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
      }
      
      return { success: true, message: 'Checkout session completed but no action taken' };
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: customer, error: customerError } = await supabaseAdmin
        .from('salons')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single();

      if (customerError) {
        console.error('Error fetching customer:', customerError);
        return { success: false, message: `Error fetching customer: ${customerError.message}` };
      }

      if (!customer) {
        console.error('Customer not found:', customerId);
        return { success: false, message: `Customer not found: ${customerId}` };
      }

      const { error: updateError } = await supabaseAdmin
        .from('salons')
        .update({
          subscription_status: subscription.status,
        })
        .eq('id', customer.id);

      if (updateError) {
        console.error('Error updating subscription status:', updateError);
        return { success: false, message: `Error updating subscription status: ${updateError.message}` };
      }

      return { success: true, message: 'Subscription updated successfully' };
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: customer, error: customerError } = await supabaseAdmin
        .from('salons')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single();

      if (customerError) {
        console.error('Error fetching customer:', customerError);
        return { success: false, message: `Error fetching customer: ${customerError.message}` };
      }

      if (!customer) {
        console.error('Customer not found:', customerId);
        return { success: false, message: `Customer not found: ${customerId}` };
      }

      const { error: updateError } = await supabaseAdmin
        .from('salons')
        .update({
          subscription_status: subscription.status,
        })
        .eq('id', customer.id);

      if (updateError) {
        console.error('Error updating subscription status:', updateError);
        return { success: false, message: `Error updating subscription status: ${updateError.message}` };
      }

      return { success: true, message: 'Subscription deleted successfully' };
    }
    default:
      return { success: true, message: `Unhandled event type: ${event.type}` };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('Missing Stripe secret key');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase config');

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) throw new Error('Missing stripe signature');

    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      );
    } catch (err: any) {
      console.error('Stripe webhook signature verification failed:', err.message);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });

    const { success, message } = await handleEvent(event, supabaseAdmin);

    if (success) {
      return new Response(JSON.stringify({ success: true, message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ error: message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  } catch (err: any) {
    console.error('Webhook handler failed:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
