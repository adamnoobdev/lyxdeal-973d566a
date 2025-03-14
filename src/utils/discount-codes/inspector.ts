
import { supabase } from "@/integrations/supabase/client";
import { normalizeId } from "./types";

/**
 * Detaljerad inspektion av rabattkoder för ett specifikt erbjudande
 * Används i admin UI för felsökning
 */
export const inspectDiscountCodes = async (dealId: string | number) => {
  console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ${dealId} (type: ${typeof dealId})...`);
  console.log(`[inspectDiscountCodes] Deal ID type: ${typeof dealId}, value: ${dealId}`);
  
  try {
    // Normalisera ID:t för att säkerställa korrekt datatyp i databasen
    const normalizedId = normalizeId(dealId);
    console.log(`[inspectDiscountCodes] Normalized deal ID: ${normalizedId} (type: ${typeof normalizedId})`);
    
    // Först försöker vi hitta koder med det normaliserade ID:t
    const { data: directCodes, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('deal_id', normalizedId)
      .limit(10);
      
    if (error) {
      console.error('[inspectDiscountCodes] Query error:', error);
      return { 
        success: false, 
        error: error,
        message: `Ett fel uppstod vid inspektion av rabattkoder: ${error.message}`
      };
    }
    
    if (directCodes && directCodes.length > 0) {
      const sampleCodes = directCodes.slice(0, 5).map(code => ({
        code: code.code,
        isUsed: code.is_used,
        dealId: code.deal_id,
        dealIdType: typeof code.deal_id
      }));
      
      return {
        success: true,
        codesCount: directCodes.length,
        message: `Hittade ${directCodes.length} rabattkoder för erbjudande #${dealId}`,
        sampleCodes,
        codeType: typeof directCodes[0].deal_id
      };
    }
    
    // Om direkta koder inte hittades, prova string-jämförelse
    console.log('[inspectDiscountCodes] Trying string comparison approach...');
    
    // Hämta alla koder för jämförelse
    const { data: allCodes, error: allCodesError } = await supabase
      .from('discount_codes')
      .select('*');
      
    if (allCodesError) {
      console.error('[inspectDiscountCodes] Error fetching all codes:', allCodesError);
      return {
        success: false,
        error: allCodesError,
        message: 'Ett fel uppstod när alla rabattkoder skulle hämtas'
      };
    }
    
    // Inspektera tabellstrukturen för att förstå datatyper
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
      
    if (tablesError) {
      console.error('[inspectDiscountCodes] Error fetching tables:', tablesError);
    }
    
    console.log('[inspectDiscountCodes] Database tables:', tables);
    
    if (allCodes && allCodes.length > 0) {
      // Extrahera alla unika deal_ids för analys
      const dealIds = [...new Set(allCodes.map(c => c.deal_id))];
      const dealIdTypes = [...new Set(allCodes.map(c => typeof c.deal_id))];
      
      // Sök efter match med strängkonvertering
      const stringDealId = String(dealId);
      const stringMatches = allCodes.filter(code => String(code.deal_id) === stringDealId);
      
      if (stringMatches.length > 0) {
        const sampleCodes = stringMatches.slice(0, 5).map(code => ({
          code: code.code,
          isUsed: code.is_used,
          dealId: code.deal_id,
          dealIdType: typeof code.deal_id
        }));
        
        return {
          success: true,
          codesCount: stringMatches.length,
          message: `Hittade ${stringMatches.length} rabattkoder med string-jämförelse`,
          sampleCodes,
          codeType: typeof stringMatches[0].deal_id
        };
      }
      
      // Om vi fortfarande inte hittat något, visa generell info om tillgängliga deal IDs
      const sampleCodes = allCodes.slice(0, 5).map(code => ({
        code: code.code,
        dealId: code.deal_id,
        dealIdType: typeof code.deal_id
      }));
      
      return {
        success: false,
        message: 'Hittade inte rabattkoder specifikt för detta erbjudande',
        codesFoundForDeals: dealIds,
        sampleCodes,
        dealIdTypes,
        tables
      };
    }
    
    return {
      success: false,
      message: 'Inga rabattkoder hittades i databasen',
      tables
    };
  } catch (error) {
    console.error('[inspectDiscountCodes] Exception:', error);
    return { 
      success: false, 
      error,
      message: 'Ett kritiskt fel uppstod vid inspektion'
    };
  }
};
