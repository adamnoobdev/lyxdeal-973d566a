
import { supabase } from "@/integrations/supabase/client";

/**
 * Uppdaterar alla salonger för att godkänna villkoren och integritetspolicyn
 */
export const updateAllSalonsTermsAcceptance = async (): Promise<boolean> => {
  try {
    console.log("Updating all salons to accept terms and privacy policy");
    
    const { error } = await supabase
      .from("salons")
      .update({ 
        terms_accepted: true,
        privacy_accepted: true 
      })
      .is('terms_accepted', null);
      
    if (error) {
      console.error("Error updating salons terms acceptance:", error);
      return false;
    }
    
    // Uppdatera även de som har false värden
    const { error: error2 } = await supabase
      .from("salons")
      .update({ 
        terms_accepted: true,
        privacy_accepted: true 
      })
      .eq('terms_accepted', false);
      
    if (error2) {
      console.error("Error updating salons with false terms acceptance:", error2);
      return false;
    }
    
    // Uppdatera även de som har null för privacy_accepted
    const { error: error3 } = await supabase
      .from("salons")
      .update({ 
        privacy_accepted: true 
      })
      .is('privacy_accepted', null);
      
    if (error3) {
      console.error("Error updating salons privacy acceptance:", error3);
      return false;
    }
    
    // Uppdatera även de som har false för privacy_accepted
    const { error: error4 } = await supabase
      .from("salons")
      .update({ 
        privacy_accepted: true 
      })
      .eq('privacy_accepted', false);
      
    if (error4) {
      console.error("Error updating salons with false privacy acceptance:", error4);
      return false;
    }
    
    console.log("Successfully updated all salons to accept terms and privacy policy");
    return true;
  } catch (err) {
    console.error("Exception in updateAllSalonsTermsAcceptance:", err);
    return false;
  }
};
