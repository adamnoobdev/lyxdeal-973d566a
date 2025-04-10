
import { supabase } from "@/integrations/supabase/client";
import { Salon } from "@/components/admin/types";

/**
 * Prepares a salon object for the edit form
 * 
 * @param salon The salon object from database
 * @returns Formatted object for the edit form
 */
export const getInitialValuesForEdit = async (salon: Salon) => {
  console.log("Preparing salon for edit:", salon);
  
  try {
    // Get additional salon data from database to ensure we have the latest subscription information
    const { data, error } = await supabase
      .from("salons")
      .select("subscription_plan, subscription_type, skip_subscription")
      .eq("id", salon.id)
      .single();
    
    let subscriptionPlan = "Baspaket";
    let subscriptionType = "monthly";
    let skipSubscription = false;
    
    if (error) {
      console.error("Error fetching additional salon data:", error);
      // If error contains specific message about missing column, log it but continue
      if (error.message && error.message.includes("skip_subscription")) {
        console.warn("skip_subscription column might be missing from salons table. Using default values.");
      }
    } else if (data) {
      console.log("Additional salon data:", data);
      
      subscriptionPlan = data.subscription_plan || "Baspaket";
      subscriptionType = data.subscription_type || "monthly";
      skipSubscription = !!data.skip_subscription;
    }
    
    console.log("Source subscription data:", {
      plan: data?.subscription_plan || "Not set in DB (will default to Baspaket)",
      type: data?.subscription_type || "Not set in DB (will default to monthly)",
      skip: data?.skip_subscription !== undefined ? data?.skip_subscription : "Not set in DB (will default to false)"
    });
    
    const finalValues = {
      name: salon.name,
      email: salon.email,
      phone: salon.phone || "",
      address: salon.address || "",
      termsAccepted: salon.terms_accepted !== undefined ? salon.terms_accepted : true,
      privacyAccepted: salon.privacy_accepted !== undefined ? salon.privacy_accepted : true,
      subscriptionPlan: subscriptionPlan,
      subscriptionType: subscriptionType,
      skipSubscription: skipSubscription
    };
    
    console.log("Final subscription values to use in form:", {
      plan: finalValues.subscriptionPlan,
      type: finalValues.subscriptionType,
      skipSubscription: finalValues.skipSubscription,
      hasPlanField: !!data?.subscription_plan,
      hasTypeField: !!data?.subscription_type
    });
    
    return finalValues;
  } catch (err) {
    console.error("Error preparing salon data for edit:", err);
    
    // Return basic values if there was an error
    return {
      name: salon.name,
      email: salon.email,
      phone: salon.phone || "",
      address: salon.address || "",
      termsAccepted: salon.terms_accepted !== undefined ? salon.terms_accepted : true,
      privacyAccepted: salon.privacy_accepted !== undefined ? salon.privacy_accepted : true,
      subscriptionPlan: "Baspaket",
      subscriptionType: "monthly",
      skipSubscription: false
    };
  }
};
