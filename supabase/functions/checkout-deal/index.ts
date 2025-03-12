
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// Konstanter
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

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

function generateRandomCode(length: number = 8): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return code;
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

async function getAvailableDiscountCode(supabaseAdmin: any, dealId: number, generateIfMissing: boolean = false) {
  const { data: discountCodes, error: codeError } = await supabaseAdmin
    .from('discount_codes')
    .select('*')
    .eq('deal_id', dealId)
    .is('customer_email', null)
    .limit(1);

  if (codeError) {
    console.error('Error fetching discount code:', codeError);
    throw new Error('Kunde inte hämta rabattkod');
  }
  
  // Om det inte finns tillgängliga koder och generateIfMissing är true, generera nya koder
  if ((!discountCodes || discountCodes.length === 0) && generateIfMissing) {
    console.log(`No available discount codes for deal ${dealId}. Generating new codes.`);
    
    try {
      // Generera 10 nya rabattkoder för erbjudandet
      const newCodes = Array.from({ length: 10 }, () => ({
        deal_id: dealId,
        code: generateRandomCode(8)
      }));
      
      const { data: insertedCodes, error: insertError } = await supabaseAdmin
        .from('discount_codes')
        .insert(newCodes)
        .select();
      
      if (insertError) {
        console.error('Error generating new discount codes:', insertError);
        throw new Error('Kunde inte generera nya rabattkoder');
      }
      
      if (!insertedCodes || insertedCodes.length === 0) {
        throw new Error('Kunde inte generera nya rabattkoder');
      }
      
      console.log(`Generated ${insertedCodes.length} new discount codes for deal ${dealId}`);
      
      // Returnera den första av de nya koderna
      return insertedCodes[0];
    } catch (error) {
      console.error('Failed to generate new discount codes:', error);
      throw new Error('Det finns inga rabattkoder kvar för detta erbjudande');
    }
  }
  
  if (!discountCodes || discountCodes.length === 0) {
    console.error('No available discount codes for deal:', dealId);
    throw new Error('Det finns inga rabattkoder kvar för detta erbjudande');
  }

  return discountCodes[0];
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

async function decreaseQuantity(supabaseAdmin: any, dealId: number) {
  try {
    // Försök först att använda RPC-funktionen
    const { error: decreaseError } = await supabaseAdmin.rpc('decrease_quantity', {
      price_id: `deal_${dealId}`
    });

    if (decreaseError) {
      console.error('Error using RPC to decrease quantity:', decreaseError);
      
      // Om RPC misslyckas, försök med direkt uppdatering av tabellen
      const { data: updateResult, error: updateError } = await supabaseAdmin
        .from('deals')
        .update({ quantity_left: supabaseAdmin.sql('quantity_left - 1') })
        .eq('id', dealId)
        .gt('quantity_left', 0)
        .select('quantity_left');
      
      if (updateError) {
        console.error('Error decreasing quantity with direct update:', updateError);
        throw new Error('Kunde inte minska antalet tillgängliga erbjudanden');
      }

      if (!updateResult || updateResult.length === 0 || updateResult[0].quantity_left < 0) {
        console.error('Deal might be sold out, quantity not decreased');
        throw new Error('Detta erbjudande är slutsålt');
      }
    }
  } catch (error) {
    console.error('Failed to decrease quantity:', error);
    // Vi fortsätter ändå om det inte är ett kritiskt fel från vår egen kod
    if (error instanceof Error && 
        (error.message === 'Kunde inte minska antalet tillgängliga erbjudanden' || 
         error.message === 'Detta erbjudande är slutsålt')) {
      throw error;
    }
  }
}

async function createPurchaseRecord(supabaseAdmin: any, dealId: number, customerEmail: string, discountCode: string) {
  try {
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
    }
  } catch (error) {
    console.error('Failed to create purchase record:', error);
    // Vi fortsätter ändå, för detta är inte ett kritiskt fel
  }
}

async function sendDiscountCodeEmail(dealTitle: string, customerInfo: any, discountCode: string) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    if (!supabaseUrl) throw new Error('Missing SUPABASE_URL environment variable');

    const functionUrl = `${supabaseUrl}/functions/v1/send-discount-email`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        discountCode: discountCode,
        dealTitle: dealTitle,
        expiryHours: 72
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error sending email:', errorText);
      // We continue execution even if email fails, as this is not critical for the checkout process
    } else {
      const result = await response.json();
      console.log('Email sent successfully:', result);
    }
  } catch (error) {
    console.error('Failed to send discount code email:', error);
    // We continue execution even if email fails
  }
}

// Huvudfunktion för att hantera checkout-flödet
async function handleCheckout(req: Request) {
  try {
    const { dealId, customerInfo, generateIfMissing = false } = await req.json();
    console.log('Processing checkout for deal:', dealId, 'Customer:', customerInfo, 'Generate if missing:', generateIfMissing);

    if (!dealId) {
      console.error('No deal ID provided');
      return createErrorResponse('No deal ID provided', 400);
    }
    
    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      console.error('Missing customer information');
      return createErrorResponse('Vänligen fyll i alla obligatoriska fält', 400);
    }

    const supabaseAdmin = await createSupabaseClient();

    // Hämta deal-information
    const deal = await getDealInfo(supabaseAdmin, dealId);

    // Kontrollera om kunden redan har en kod för detta erbjudande
    await checkExistingCode(supabaseAdmin, dealId, customerInfo.email);

    // Hitta en tillgänglig rabattkod eller generera ny om alternativet är aktiverat
    const discountCode = await getAvailableDiscountCode(supabaseAdmin, dealId, generateIfMissing);

    // Uppdatera rabattkoden med kundinformation
    await assignDiscountCodeToCustomer(supabaseAdmin, discountCode.id, customerInfo);

    // Minska antalet tillgängliga koder
    await decreaseQuantity(supabaseAdmin, dealId);

    // Skapa ett köpregister
    await createPurchaseRecord(supabaseAdmin, dealId, customerInfo.email, discountCode.code);

    // Skicka rabattkoden via e-post
    await sendDiscountCodeEmail(deal.title, customerInfo, discountCode.code);

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
