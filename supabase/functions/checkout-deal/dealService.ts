
import { generateRandomCode } from './utils.ts';

// Get deal information
export async function getDealInfo(supabaseAdmin: any, dealId: number) {
  try {
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
  } catch (error) {
    console.error('Error in getDealInfo:', error);
    throw error;
  }
}

// Check if the customer already has a code for this deal
export async function checkExistingCode(supabaseAdmin: any, dealId: number, customerEmail: string) {
  try {
    const { data: existingCodes, error: existingCodesError } = await supabaseAdmin
      .from('discount_codes')
      .select('code')
      .eq('deal_id', dealId)
      .eq('customer_email', customerEmail);

    if (existingCodesError) {
      console.error('Error checking existing codes:', existingCodesError);
      // We continue anyway, as this is not a critical error
    } else if (existingCodes && existingCodes.length > 0) {
      // Customer already has a code for this deal
      throw new Error('Du har redan säkrat en rabattkod för detta erbjudande. Kontrollera din e-post.');
    }
  } catch (error) {
    console.error('Error in checkExistingCode:', error);
    throw error;
  }
}

// Generate new discount codes for a deal
export async function generateNewDiscountCodes(supabaseAdmin: any, dealId: number, quantity: number = 10) {
  try {
    // Generate new discount codes for the deal
    const newCodes = Array.from({ length: quantity }, () => ({
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
    
    return insertedCodes;
  } catch (error) {
    console.error('Failed to generate new discount codes:', error);
    throw error;
  }
}

// Get an available discount code for a deal
export async function getAvailableDiscountCode(supabaseAdmin: any, dealId: number, generateIfMissing: boolean = false) {
  try {
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
    
    // If there are no available codes and generateIfMissing is true, generate new codes
    if ((!discountCodes || discountCodes.length === 0) && generateIfMissing) {
      console.log(`No available discount codes for deal ${dealId}. Generating new codes.`);
      
      const insertedCodes = await generateNewDiscountCodes(supabaseAdmin, dealId);
      
      // Return the first of the new codes
      return insertedCodes[0];
    }
    
    if (!discountCodes || discountCodes.length === 0) {
      console.error('No available discount codes for deal:', dealId);
      throw new Error('Det finns inga rabattkoder kvar för detta erbjudande');
    }

    return discountCodes[0];
  } catch (error) {
    console.error('Error in getAvailableDiscountCode:', error);
    throw error;
  }
}

// Assign discount code to customer
export async function assignDiscountCodeToCustomer(supabaseAdmin: any, discountCodeId: number, customerInfo: any) {
  try {
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
  } catch (error) {
    console.error('Error in assignDiscountCodeToCustomer:', error);
    throw error;
  }
}

// Decrease the quantity of available discount codes
export async function decreaseQuantity(supabaseAdmin: any, dealId: number) {
  try {
    // First try to use the RPC function
    const { error: decreaseError } = await supabaseAdmin.rpc('decrease_quantity', {
      price_id: `deal_${dealId}`
    });

    if (decreaseError) {
      console.error('Error using RPC to decrease quantity:', decreaseError);
      
      // If RPC fails, try direct table update
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
    // Continue anyway if it's not a critical error from our own code
    if (error instanceof Error && 
        (error.message === 'Kunde inte minska antalet tillgängliga erbjudanden' || 
         error.message === 'Detta erbjudande är slutsålt')) {
      throw error;
    }
  }
}

// Create a purchase record
export async function createPurchaseRecord(supabaseAdmin: any, dealId: number, customerEmail: string, discountCode: string) {
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
      // Continue anyway, as this is not a critical error
    }
  } catch (error) {
    console.error('Failed to create purchase record:', error);
    // Continue anyway, as this is not a critical error
  }
}

// Send discount code email
export async function sendDiscountCodeEmail(dealTitle: string, customerInfo: any, discountCode: string) {
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
