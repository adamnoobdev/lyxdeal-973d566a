
import { supabase } from "@/integrations/supabase/client";

// Funktion för att generera en slumpmässig rabattkod
export const generateRandomCode = (length = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Funktion för att skapa en ny rabattkod i databasen
export const createNewDiscountCode = async (dealId: number, code: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("discount_codes")
      .insert({
        deal_id: dealId,
        code: code,
        is_used: false
      });
      
    if (error) {
      console.error("Error creating discount code:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception creating discount code:", error);
    return false;
  }
};

// Funktion för att spara att ett erbjudande har blivit använt
export const saveClaimedDeal = (dealId: number) => {
  const storedClaims = localStorage.getItem('claimed_deals') || '[]';
  const claimedDeals = JSON.parse(storedClaims);
  
  if (!claimedDeals.includes(dealId.toString())) {
    claimedDeals.push(dealId.toString());
    localStorage.setItem('claimed_deals', JSON.stringify(claimedDeals));
  }
};
