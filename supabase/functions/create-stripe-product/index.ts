
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { dealId } = await req.json()

    console.log('Creating record for deal (no longer using Stripe):', dealId)

    // Query for the deal to ensure it exists
    const { data: deal, error: dealError } = await supabaseClient
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .single()

    if (dealError) {
      console.error('Error fetching deal:', dealError)
      throw new Error('Error fetching deal details')
    }

    // Update the deal to set is_free to true and discounted_price to 0
    const { error: updateError } = await supabaseClient
      .from('deals')
      .update({ 
        is_free: true,
        discounted_price: 0,
        status: 'approved' 
      })
      .eq('id', dealId)

    if (updateError) {
      console.error('Error updating deal:', updateError)
      throw new Error('Error updating deal with free status')
    }
    
    console.log('Successfully processed deal')

    return new Response(
      JSON.stringify({ success: true }),
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
