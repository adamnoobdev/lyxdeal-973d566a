
import { supabase } from "@/integrations/supabase/client";
import { DiscountCodeInspectionResult, normalizeId } from "./types";

/**
 * Kontrollerar om rabattkoder existerar för ett specifikt erbjudande
 * Användbart för felsökning av saknade koder
 */
export const inspectDiscountCodes = async (dealId: string | number): Promise<DiscountCodeInspectionResult> => {
  console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ${dealId} (type: ${typeof dealId})...`);
  
  try {
    // Kontrollera deal_id-typ för diagnostik
    console.log(`[inspectDiscountCodes] Deal ID type: ${typeof dealId}, value: ${dealId}`);
    
    // Normalize the ID for database query
    const normalizedId = normalizeId(dealId);
    console.log(`[inspectDiscountCodes] Normalized deal ID: ${normalizedId} (type: ${typeof normalizedId})`);
    
    // First, try querying with the normalized ID
    const { data: codes, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', normalizedId);
      
    if (error) {
      console.error('[inspectDiscountCodes] Error querying codes:', error);
    }
    
    // Codes were found using the normalized ID, return details
    if (codes && codes.length > 0) {
      console.log(`[inspectDiscountCodes] Found ${codes.length} codes for deal ${dealId} using normalized ID`);
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
    
    // Now try string comparison approach if normalized approach didn't find anything
    console.log('[inspectDiscountCodes] Trying string comparison approach...');
    const stringDealId = String(dealId);
    
    const { data: allCodes, error: allCodesError } = await supabase
      .from('discount_codes')
      .select('*')
      .limit(100); // Retrieve more codes for better inspection
    
    if (allCodesError) {
      console.error('[inspectDiscountCodes] Error in fallback query:', allCodesError);
      return { 
        success: false, 
        message: 'Ett fel uppstod vid inspektion av rabattkoder',
        dealId,
        error: allCodesError
      };
    }
    
    if (!allCodes || allCodes.length === 0) {
      // No discount codes found at all
      try {
        // Check if the table exists at all
        const { data: tablesData } = await supabase.rpc('get_tables');
        console.log('[inspectDiscountCodes] Database tables:', tablesData);
        
        return { 
          success: false, 
          message: 'Inga rabattkoder hittades i databasen', 
          dealId,
          totalCodesInDatabase: 0
        };
      } catch (error) {
        console.error('[inspectDiscountCodes] Error checking tables:', error);
        return { 
          success: false, 
          message: 'Inga rabattkoder hittades och kunde inte inspektera databasen', 
          dealId,
          totalCodesInDatabase: 0,
          error
        };
      }
    }
    
    // Sök efter matchningar med strängvärden
    const valueMatches = allCodes.filter(c => String(c.deal_id) === stringDealId);
    
    if (valueMatches.length > 0) {
      console.log(`[inspectDiscountCodes] Found ${valueMatches.length} codes with string matching:`, 
        valueMatches.map(c => ({ code: c.code, dealId: c.deal_id, dealIdType: typeof c.deal_id })));
          
      return {
        success: true,
        message: `Hittade ${valueMatches.length} koder för erbjudande ${dealId} med värdematchning`,
        dealId,
        codesCount: valueMatches.length,
        sampleCodes: valueMatches.slice(0, 5).map(c => ({ 
          code: c.code, 
          isUsed: c.is_used,
          createdAt: c.created_at,
          dealId: c.deal_id,
          dealIdType: typeof c.deal_id
        })),
        codeType: typeof valueMatches[0].deal_id
      };
    }
    
    // Visa exempel på koder från andra erbjudanden
    console.log(`[inspectDiscountCodes] Found ${allCodes.length} codes for other deals`);
    
    // Samla information om deal_id-typer i databasen
    const dealIdTypes = [...new Set(allCodes.map(c => typeof c.deal_id))];
    const dealIdsInDatabase = [...new Set(allCodes.map(c => c.deal_id))];
    console.log('[inspectDiscountCodes] Deal ID types in database:', dealIdTypes);
    console.log('[inspectDiscountCodes] Deal IDs found:', dealIdsInDatabase);
    
    return { 
      success: false, 
      message: `Inga koder hittades för erbjudande ${dealId}, men hittade koder för andra erbjudanden`, 
      dealId,
      totalCodesInDatabase: allCodes.length,
      codesFoundForDeals: dealIdsInDatabase,
      dealIdTypes: dealIdTypes,
      sampleCodes: allCodes.slice(0, 5).map(c => ({
        code: c.code,
        dealId: c.deal_id,
        dealIdType: typeof c.deal_id
      }))
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
