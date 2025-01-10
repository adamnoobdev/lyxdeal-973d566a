import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.10.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { title, description, discountedPrice, dealId } = await req.json()

    console.log('Creating Stripe product for deal:', { title, description, discountedPrice, dealId })

    // Create a product in Stripe
    const product = await stripe.products.create({
      name: title,
      description: description,
    })

    console.log('Created Stripe product:', product.id)

    // Create a price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: discountedPrice * 100, // Convert to cents
      currency: 'sek',
    })

    console.log('Created Stripe price:', price.id)

    // Update the deal with the Stripe price ID
    const { error: updateError } = await supabaseClient
      .from('deals')
      .update({ stripe_price_id: price.id })
      .eq('id', dealId)

    if (updateError) {
      console.error('Error updating deal with Stripe price ID:', updateError)
      throw updateError
    }

    console.log('Successfully updated deal with Stripe price ID')

    return new Response(
      JSON.stringify({ priceId: price.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in create-stripe-product function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})