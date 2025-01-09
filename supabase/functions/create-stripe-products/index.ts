import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.10.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all deals from the database
    const { data: deals, error: dealsError } = await supabaseClient
      .from('deals')
      .select('*')

    if (dealsError) throw dealsError

    console.log(`Found ${deals.length} deals to process`)

    // Process each deal
    for (const deal of deals) {
      try {
        console.log(`Processing deal: ${deal.title}`)

        // Create a product in Stripe
        const product = await stripe.products.create({
          name: deal.title,
          description: deal.description,
          images: [deal.image_url],
        })

        console.log(`Created Stripe product: ${product.id}`)

        // Create a price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: deal.discounted_price * 100, // Convert to cents
          currency: 'sek',
        })

        console.log(`Created Stripe price: ${price.id}`)

        // Update the deal with the Stripe price ID
        const { error: updateError } = await supabaseClient
          .from('deals')
          .update({ stripe_price_id: price.id })
          .eq('id', deal.id)

        if (updateError) {
          console.error(`Error updating deal ${deal.id}:`, updateError)
          continue
        }

        console.log(`Updated deal ${deal.id} with price ID: ${price.id}`)
      } catch (error) {
        console.error(`Error processing deal ${deal.id}:`, error)
        continue
      }
    }

    return new Response(
      JSON.stringify({ message: 'Products created successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})