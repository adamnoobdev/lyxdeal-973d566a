
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates a salon's subscription data using a dedicated edge function
 */
export const updateSalonSubscription = async (salonId: number, subscriptionPlan: string, subscriptionType: string) => {
  try {
    console.log(`Updating salon ${salonId} subscription to: ${subscriptionPlan} (${subscriptionType})`);
    
    // Skapa ett standardsvar om edge-funktionen misslyckas
    let data;
    
    try {
      // Call the dedicated edge function
      const response = await supabase.functions.invoke("update-salon-subscription", {
        body: {
          salonId,
          subscriptionPlan,
          subscriptionType
        }
      });
      
      if (response.error) {
        console.error("Edge function error updating salon subscription:", response.error);
        throw response.error;
      }
      
      data = response.data;
      console.log("Edge function subscription update response:", data);
    } catch (edgeError) {
      console.error("Edge function call failed, fallback to direct update:", edgeError);
      
      // Fallback: Uppdatera direkt mot databasen
      const { data: directData, error: directError } = await supabase
        .from("salons")
        .update({
          subscription_plan: subscriptionPlan,
          subscription_type: subscriptionType
        })
        .eq("id", salonId)
        .select();
        
      if (directError) {
        console.error("Direct update fallback error:", directError);
        throw directError;
      }
      
      data = { success: true, data: directData, fallback: true };
      console.log("Direct update fallback response:", data);
    }
    
    // Verifiera uppdateringen genom att hämta den senaste datan
    const { data: verifyData, error: verifyError } = await supabase
      .from("salons")
      .select("id, subscription_plan, subscription_type")
      .eq("id", salonId)
      .single();
      
    if (!verifyError) {
      console.log("Subscription update verified:", verifyData);
      if (verifyData.subscription_plan !== subscriptionPlan) {
        console.warn(`Verification mismatch: Expected plan ${subscriptionPlan}, got ${verifyData.subscription_plan}`);
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error updating salon subscription:", error);
    throw error;
  }
};
