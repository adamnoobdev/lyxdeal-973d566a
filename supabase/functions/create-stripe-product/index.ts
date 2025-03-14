
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

    console.log('Creating free record for deal:', dealId)

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

    // Check if the deal should be marked as free
    const isFree = deal.is_free || deal.discounted_price === 0

    // Update the deal
    const { error: updateError } = await supabaseClient
      .rpc('update_deal_to_free', { 
        deal_id: dealId,
        deal_status: 'approved' 
      })

    if (updateError) {
      console.error('Error updating deal:', updateError)
      throw new Error(`Error updating deal with free status: ${updateError.message}`)
    }
    
    console.log('Successfully processed deal as free')

    return new Response(
      JSON.stringify({ success: true, isFree: isFree }),
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
