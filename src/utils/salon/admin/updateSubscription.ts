
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates a salon's subscription data using a dedicated edge function
 */
export const updateSalonSubscription = async (salonId: number, subscriptionPlan: string, subscriptionType: string) => {
  try {
    console.log(`Updating salon ${salonId} subscription to: ${subscriptionPlan} (${subscriptionType})`);
    
    // Call the dedicated edge function
    const { data, error } = await supabase.functions.invoke("update-salon-subscription", {
      body: {
        salonId,
        subscriptionPlan,
        subscriptionType
      }
    });

    if (error) {
      console.error("Edge function error updating salon subscription:", error);
      throw error;
    }
    
    console.log("Subscription update response:", data);
    return data;
  } catch (error) {
    console.error("Error updating salon subscription:", error);
    throw error;
  }
};
