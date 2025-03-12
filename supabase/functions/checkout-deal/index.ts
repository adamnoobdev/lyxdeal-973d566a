
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { 
  corsHeaders, 
  createErrorResponse, 
  createSuccessResponse 
} from './utils.ts';
import { 
  getDealInfo, 
  checkExistingCode, 
  getAvailableDiscountCode, 
  assignDiscountCodeToCustomer, 
  decreaseQuantity,
  createPurchaseRecord,
  sendDiscountCodeEmail
} from './dealService.ts';

// Main function for handling checkout flow
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return createErrorResponse('Server configuration error', 500);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Fetch deal information
    const deal = await getDealInfo(supabaseAdmin, dealId);

    // Check if customer already has a code for this deal
    await checkExistingCode(supabaseAdmin, dealId, customerInfo.email);

    // Get an available discount code or generate new if the option is activated
    const discountCode = await getAvailableDiscountCode(supabaseAdmin, dealId, generateIfMissing);

    // Update the discount code with customer information
    await assignDiscountCodeToCustomer(supabaseAdmin, discountCode.id, customerInfo);

    // Decrease the number of available codes
    await decreaseQuantity(supabaseAdmin, dealId);

    // Create a purchase record
    await createPurchaseRecord(supabaseAdmin, dealId, customerInfo.email, discountCode.code);

    // Send the discount code via email
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

// Main function run by Deno
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleCheckout(req);
});
