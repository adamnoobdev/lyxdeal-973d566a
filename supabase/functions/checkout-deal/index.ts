
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Stripe } from 'https://esm.sh/stripe@14.21.0';

// Konstanter
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hjälpfunktioner
function createErrorResponse(error: string, status: number) {
  return new Response(
    JSON.stringify({ error }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status
    }
  );
}

function createSuccessResponse(data: any) {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    }
  );
}

async function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration');
    throw new Error('Server configuration error');
  }

  return createClient(supabaseUrl, supabaseKey);
}

async function getDealInfo(supabaseAdmin: any, dealId: number) {
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

  if (deal.quantity_left <= 0) {
    console.error('Deal is sold out:', dealId);
    throw new Error('Detta erbjudande är slutsålt');
  }

  return deal;
}

async function checkExistingCode(supabaseAdmin: any, dealId: number, customerEmail: string) {
  const { data: existingCodes, error: existingCodesError } = await supabaseAdmin
    .from('discount_codes')
    .select('code')
    .eq('deal_id', dealId)
    .eq('customer_email', customerEmail);

  if (existingCodesError) {
    console.error('Error checking existing codes:', existingCodesError);
    // Vi fortsätter ändå, för detta är inte ett kritiskt fel
  } else if (existingCodes && existingCodes.length > 0) {
    // Kunden har redan en kod för detta erbjudande
    throw new Error('Du har redan säkrat en rabattkod för detta erbjudande. Kontrollera din e-post.');
  }
}

async function getAvailableDiscountCode(supabaseAdmin: any, dealId: number) {
  const { data: discountCode, error: codeError } = await supabaseAdmin
    .from('discount_codes')
    .select('*')
    .eq('deal_id', dealId)
    .is('customer_email', null)
    .limit(1)
    .single();

  if (codeError || !discountCode) {
    console.error('Error fetching discount code:', codeError);
    throw new Error('Det finns inga rabattkoder kvar för detta erbjudande');
  }

  return discountCode;
}

async function assignDiscountCodeToCustomer(supabaseAdmin: any, discountCodeId: number, customerInfo: any) {
  const { error: updateError } = await supabaseAdmin
    .from('discount_codes')
    .update({
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone || null
    })
    .eq('id', discountCodeId);

  if (updateError) {
    console.error('Error updating discount code:', updateError);
    throw new Error('Failed to update discount code');
  }
}

async function decreaseQuantity(supabaseAdmin: any, priceId: string) {
  const { error: decreaseError } = await supabaseAdmin.rpc('decrease_quantity', {
    price_id: priceId || 'free_deal'
  });

  if (decreaseError) {
    console.error('Error decreasing quantity:', decreaseError);
    // Vi fortsätter ändå, för detta är inte ett kritiskt fel
  }
}

async function createPurchaseRecord(supabaseAdmin: any, dealId: number, customerEmail: string, discountCode: string) {
  const { error: purchaseError } = await supabaseAdmin
    .from('purchases')
    .insert({
      deal_id: dealId,
      customer_email: customerEmail,
      discount_code: discountCode,
      status: 'completed'
    });

  if (purchaseError) {
    console.error('Error creating purchase record:', purchaseError);
    // Vi fortsätter ändå, för detta är inte ett kritiskt fel
  }
}

// Huvudfunktion för att hantera checkout-flödet
async function handleCheckout(req: Request) {
  try {
    const { dealId, customerInfo } = await req.json();
    console.log('Processing checkout for deal:', dealId, 'Customer:', customerInfo);

    if (!dealId) {
      console.error('No deal ID provided');
      return createErrorResponse('No deal ID provided', 400);
    }

    const supabaseAdmin = await createSupabaseClient();

    // Hämta deal-information
    const deal = await getDealInfo(supabaseAdmin, dealId);

    // Kontrollera om kunden redan har en kod för detta erbjudande
    await checkExistingCode(supabaseAdmin, dealId, customerInfo.email);

    // Alla erbjudanden behandlas nu som "gratis" eftersom vi inte tar betalt i förväg
    // Hitta en tillgänglig rabattkod
    const discountCode = await getAvailableDiscountCode(supabaseAdmin, dealId);

    // Uppdatera rabattkoden med kundinformation
    await assignDiscountCodeToCustomer(supabaseAdmin, discountCode.id, customerInfo);

    // Minska antalet tillgängliga koder
    await decreaseQuantity(supabaseAdmin, deal.stripe_price_id);

    // Skapa ett köpregister
    await createPurchaseRecord(supabaseAdmin, dealId, customerInfo.email, discountCode.code);

    return createSuccessResponse({ 
      free: true, 
      code: discountCode.code 
    });

  } catch (error) {
    console.error('Error in checkout process:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Ett oväntat fel uppstod',
      500
    );
  }
}

// Huvudfunktion som körs av Deno
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleCheckout(req);
});
