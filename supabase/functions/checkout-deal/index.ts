
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
        JSON.stringify({ error: 'Detta erbjudande är slutsålt' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Check if customer already has a code for this deal
    const { data: existingCodes, error: existingCodesError } = await supabaseAdmin
      .from('discount_codes')
      .select('code')
      .eq('deal_id', dealId)
      .eq('customer_email', customerInfo.email);

    if (existingCodesError) {
      console.error('Error checking existing codes:', existingCodesError);
    } else if (existingCodes && existingCodes.length > 0) {
      // Customer already has a code for this deal
      return new Response(
        JSON.stringify({ 
          error: 'Du har redan säkrat en rabattkod för detta erbjudande. Kontrollera din e-post.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // All deals are now treated as "free" since we don't charge anything upfront
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
        JSON.stringify({ error: 'Det finns inga rabattkoder kvar för detta erbjudande' }),
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
      price_id: deal.stripe_price_id || 'free_deal'
    });

    if (decreaseError) {
      console.error('Error decreasing quantity:', decreaseError);
    }

    // Create a purchase record
    const { error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert({
        deal_id: dealId,
        customer_email: customerInfo.email,
        discount_code: discountCode.code,
        status: 'completed'
      });

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError);
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

  } catch (error) {
    console.error('Error in checkout process:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
