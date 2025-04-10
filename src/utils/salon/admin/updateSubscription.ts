
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates a salon's subscription data using a dedicated edge function
 */
export const updateSalonSubscription = async (salonId: number, subscriptionPlan: string, subscriptionType: string, skipSubscription?: boolean) => {
  try {
    console.log(`Updating salon ${salonId} subscription to: ${subscriptionPlan} (${subscriptionType}), skipSubscription: ${skipSubscription}`);
    
    // Create a default response if the edge function fails
    let data;
    
    try {
      // Call the dedicated edge function
      const response = await supabase.functions.invoke("update-salon-subscription", {
        body: {
          salonId,
          subscriptionPlan,
          subscriptionType,
          skipSubscription
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
      
      // Fallback: Update directly against the database
      const updateValues: Record<string, any> = {
        subscription_plan: subscriptionPlan,
        subscription_type: subscriptionType
      };
      
      // Add skipSubscription if it exists
      if (skipSubscription !== undefined) {
        try {
          updateValues.skip_subscription = skipSubscription;
          
          // If skipSubscription is true, set a long end date for the subscription
          if (skipSubscription) {
            // Set end date 10 years in the future for administrative salons
            updateValues.current_period_end = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
          }
        } catch (error) {
          console.warn("Failed to set skip_subscription, the column might not exist:", error);
        }
      }
      
      const { data: directData, error: directError } = await supabase
        .from("salons")
        .update(updateValues)
        .eq("id", salonId)
        .select();
        
      if (directError) {
        // If error is specifically about skip_subscription, try again without it
        if (directError.message && directError.message.includes("skip_subscription")) {
          console.warn("skip_subscription column does not exist, retrying without it");
          delete updateValues.skip_subscription;
          
          const { data: retryData, error: retryError } = await supabase
            .from("salons")
            .update(updateValues)
            .eq("id", salonId)
            .select();
            
          if (retryError) {
            console.error("Direct update fallback retry error:", retryError);
            throw retryError;
          }
          
          data = { success: true, data: retryData, fallback: true };
          console.log("Direct update fallback retry response:", data);
        } else {
          console.error("Direct update fallback error:", directError);
          throw directError;
        }
      } else {
        data = { success: true, data: directData, fallback: true };
        console.log("Direct update fallback response:", data);
      }
    }
    
    try {
      // Verify the update by fetching the latest data
      const { data: verifyData, error: verifyError } = await supabase
        .from("salons")
        .select("id, subscription_plan, subscription_type, skip_subscription")
        .eq("id", salonId)
        .single();
        
      if (verifyError) {
        console.warn("Verification error:", verifyError);
      } else if (verifyData) {
        console.log("Subscription update verified:", verifyData);
        
        if (verifyData.subscription_plan !== subscriptionPlan) {
          console.warn(`Verification mismatch: Expected plan ${subscriptionPlan}, got ${verifyData.subscription_plan}`);
        }
        
        // Verify skipSubscription if it exists in the database
        if ('skip_subscription' in verifyData && skipSubscription !== undefined && 
            verifyData.skip_subscription !== skipSubscription) {
          console.warn(`Verification mismatch: Expected skipSubscription ${skipSubscription}, got ${verifyData.skip_subscription}`);
        }
      }
    } catch (verifyErr) {
      console.warn("Error during verification:", verifyErr);
    }
    
    return data;
  } catch (error) {
    console.error("Error updating salon subscription:", error);
    throw error;
  }
};
