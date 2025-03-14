
import { supabase } from "@/integrations/supabase/client";
import { DiscountCodeInspectionResult } from "./types";

/**
 * Kontrollerar om rabattkoder existerar för ett specifikt erbjudande
 * Användbart för felsökning av saknade koder
 */
export const inspectDiscountCodes = async (dealId: number | string): Promise<DiscountCodeInspectionResult> => {
  console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ${dealId}...`);
  
  try {
    // Kontrollera deal_id-typ för diagnostik
    console.log(`[inspectDiscountCodes] Deal ID type: ${typeof dealId}, value: ${dealId}`);
    
    // Try to handle both string and number deal IDs directly
    // First attempt with the dealId as-is
    const { data: codes, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', dealId);
      
    if (error) {
      console.error('[inspectDiscountCodes] Error querying codes with ID as-is:', error);
    }
    
    // Om inga koder hittades, försök med alternativ typ
    if (!codes || codes.length === 0) {
      const altDealId = typeof dealId === 'string' ? Number(dealId) : String(dealId);
      console.log(`[inspectDiscountCodes] No codes found with original type, trying with: ${altDealId} (${typeof altDealId})`);
      
      const { data: altCodes, error: altError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('deal_id', altDealId);
        
      if (altError) {
        console.error('[inspectDiscountCodes] Error querying codes with alternative ID type:', altError);
      }
      
      if (altCodes && altCodes.length > 0) {
        console.log(`[inspectDiscountCodes] Found ${altCodes.length} codes with alternative deal_id type`);
        
        return { 
          success: true, 
          message: `Hittade ${altCodes.length} koder för erbjudande ${dealId} (med alternativ typjämförelse)`, 
          dealId,
          codesCount: altCodes.length,
          sampleCodes: altCodes.slice(0, 5).map(c => ({ 
            code: c.code, 
            isUsed: c.is_used,
            createdAt: c.created_at,
            dealId: c.deal_id,
            dealIdType: typeof c.deal_id
          }))
        };
      }
    }
    
    // Codes were found, return details
    if (codes && codes.length > 0) {
      console.log(`[inspectDiscountCodes] Found ${codes.length} codes for deal ${dealId}`);
      console.log('[inspectDiscountCodes] Sample codes:', codes.slice(0, 3).map(c => ({ code: c.code, dealId: c.deal_id, dealIdType: typeof c.deal_id })));
      
      return { 
        success: true, 
        message: `Hittade ${codes.length} koder för erbjudande ${dealId}`, 
        dealId,
        codesCount: codes.length,
        sampleCodes: codes.slice(0, 5).map(c => ({ 
          code: c.code, 
          isUsed: c.is_used,
          createdAt: c.created_at,
          dealId: c.deal_id,
          dealIdType: typeof c.deal_id
        }))
      };
    }
    
    // Try with a more general query to see if any codes exist at all
    try {
      console.log('[inspectDiscountCodes] Checking for any discount codes in database');
      const { data: allCodes, error: allCodesError } = await supabase
        .from('discount_codes')
        .select('deal_id, code')
        .limit(50); // Hämta fler koder för att se om vi kan hitta några matchande
          
      if (allCodesError) {
        console.error('[inspectDiscountCodes] Error checking all codes:', allCodesError);
        return { 
          success: false, 
          message: 'Ett fel uppstod vid kontroll av rabattkoder',
          dealId
        };
      }
      
      if (!allCodes || allCodes.length === 0) {
        console.log('[inspectDiscountCodes] No discount codes found in the database at all!');
        return { 
          success: false, 
          message: 'Inga rabattkoder hittades i databasen', 
          dealId,
          totalCodesInDatabase: 0
        };
      }
      
      // Sök efter matchningar oavsett typ
      const valueMatches = allCodes.filter(c => {
        const codeId = c.deal_id;
        return String(codeId) === String(dealId);
      });
      
      if (valueMatches.length > 0) {
        console.log(`[inspectDiscountCodes] Found ${valueMatches.length} codes with matching deal_id value:`, 
          valueMatches.map(c => ({ code: c.code, dealId: c.deal_id, dealIdType: typeof c.deal_id })));
            
        return {
          success: true,
          message: `Hittade ${valueMatches.length} koder för erbjudande ${dealId} med värdematchning`,
          dealId,
          codesCount: valueMatches.length,
          sampleCodes: valueMatches.slice(0, 5).map(c => ({ 
            code: c.code, 
            isUsed: false,
            dealId: c.deal_id,
            dealIdType: typeof c.deal_id
          })),
          codeType: typeof valueMatches[0].deal_id
        };
      }
      
      // Show examples of codes from other deals
      console.log(`[inspectDiscountCodes] Found ${allCodes.length} codes for other deals`);
      
      // Collect information about types of deal_id in the database
      const dealIdTypes = [...new Set(allCodes.map(c => typeof c.deal_id))];
      const dealIds = [...new Set(allCodes.map(c => c.deal_id))];
      console.log('[inspectDiscountCodes] Deal ID types in database:', dealIdTypes);
      console.log('[inspectDiscountCodes] Deal IDs found:', dealIds);
      
      return { 
        success: false, 
        message: `Inga koder hittades för erbjudande ${dealId}, men hittade koder för andra erbjudanden`, 
        dealId,
        totalCodesInDatabase: allCodes.length,
        codesFoundForDeals: dealIds,
        dealIdTypes: dealIdTypes,
        sampleCodes: allCodes.slice(0, 5).map(c => ({
          code: c.code,
          dealId: c.deal_id,
          dealIdType: typeof c.deal_id
        }))
      };
    } catch (error) {
      console.error('[inspectDiscountCodes] Error checking all codes:', error);
    }
    
    return { 
      success: false, 
      message: `Inga rabattkoder hittades för erbjudande ${dealId}`, 
      dealId
    };
  } catch (error) {
    console.error('[inspectDiscountCodes] CRITICAL EXCEPTION when inspecting codes:', error);
    return { 
      success: false, 
      error, 
      message: 'Ett allvarligt fel uppstod vid inspektion av rabattkoder',
      dealId
    };
  }
};
