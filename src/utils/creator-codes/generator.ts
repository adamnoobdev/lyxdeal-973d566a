
import { generateRandomCode } from "../discount-code-utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Genererar en unik rabattkod för en kreatör baserat på deras namn/handle
 */
export const generateCreatorCode = (creatorHandle: string): string => {
  // Ta bort '@' om det finns i handle
  const handleWithoutAt = creatorHandle.replace('@', '');
  
  // Ta de första 5 tecknen av handlenamnet (eller kortare om handlenamnet är kortare)
  const handlePrefix = handleWithoutAt.substring(0, Math.min(5, handleWithoutAt.length)).toUpperCase();
  
  // Generera 4 slumpmässiga tecken
  const randomSuffix = generateRandomCode(4);
  
  // Kombinera för att skapa en unik kod
  return `${handlePrefix}${randomSuffix}`;
};

/**
 * Registrerar en kreatörs rabattkod för ett specifikt erbjudande
 */
export const registerCreatorCode = async (
  creatorId: string, 
  dealId: number, 
  salonId: number,
  discountCode: string
): Promise<boolean> => {
  try {
    console.log(`Registrerar kreatorskod ${discountCode} för deal ${dealId}`);
    
    // Anropa SQL-funktionen för att skapa en creator_partnership
    const { error } = await supabase.rpc('create_creator_partnership', {
      p_creator_id: creatorId,
      p_salon_id: salonId,
      p_deal_id: dealId,
      p_discount_code: discountCode
    });
    
    if (error) {
      console.error('Fel vid registrering av partnerskap:', error);
      return false;
    }
    
    // Skapa rabattkoder i discount_codes tabellen
    const { error: codeError } = await supabase
      .from('discount_codes')
      .insert({
        deal_id: dealId,
        code: discountCode,
        is_used: false,
        created_at: new Date().toISOString()
      });
    
    if (codeError) {
      console.error('Fel vid skapande av rabattkod:', codeError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception vid registrering av kreatörskod:', error);
    toast.error('Ett fel uppstod vid registrering av rabattkod');
    return false;
  }
};

/**
 * Genererar och registrerar en ny unik rabattkod för en kreatör
 */
export const createCreatorDiscountCode = async (
  creatorId: string,
  creatorHandle: string,
  dealId: number,
  salonId: number
): Promise<string | null> => {
  try {
    // Generera en unik kod baserad på kreatörens handle
    const discountCode = generateCreatorCode(creatorHandle);
    
    // Registrera koden
    const success = await registerCreatorCode(creatorId, dealId, salonId, discountCode);
    
    if (success) {
      return discountCode;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating creator discount code:', error);
    return null;
  }
};
