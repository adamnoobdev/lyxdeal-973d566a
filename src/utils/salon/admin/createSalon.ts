
import { supabase } from "@/integrations/supabase/client";
import { sendSalonWelcomeEmail } from "./sendWelcomeEmail";

/**
 * Creates a new salon account
 */
export const createSalonData = async (values: any) => {
  try {
    // Log original values
    console.log("Creating salon with original values:", values);
    
    const valuesToSend = { ...values };
    
    // If we have the address field directly, use it
    if (values.address) {
      console.log("Using provided address:", values.address);
    }
    // Otherwise try to build it from parts if needed
    else if (values.street || values.postalCode || values.city) {
      let fullAddress = '';
      if (values.street) fullAddress += values.street;
      if (values.postalCode) {
        if (fullAddress) fullAddress += ', ';
        fullAddress += values.postalCode;
      }
      if (values.city) {
        if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
        fullAddress += values.city;
      }
      
      valuesToSend.address = fullAddress || undefined;
      console.log("Built address from parts:", valuesToSend.address);
    }
    
    // CRITICAL: Always set subscription plan, even if skipSubscription is true
    // This ensures that basic plan restrictions are properly enforced later
    if (!valuesToSend.subscriptionPlan) {
      valuesToSend.subscriptionPlan = "Baspaket"; // Default to basic plan
      console.log("Setting default subscription plan to Baspaket");
    }
    
    valuesToSend.subscriptionType = values.subscriptionType || "monthly";
    console.log("Using subscription plan:", valuesToSend.subscriptionPlan, "type:", valuesToSend.subscriptionType);
    
    // Hantera slutdatum för prenumeration
    if (values.skipSubscription && values.subscriptionEndDate) {
      console.log("Using custom end date for subscription:", values.subscriptionEndDate);
      valuesToSend.current_period_end = new Date(values.subscriptionEndDate);
    } else if (values.skipSubscription) {
      // Standardslutdatum (10 år framåt) om inget annat anges
      valuesToSend.current_period_end = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
      console.log("Using default long-term end date:", valuesToSend.current_period_end);
    }
    
    // Clean up fields we don't want to send to the edge function
    const { street, postalCode, city, fullAddress, subscriptionEndDate, ...cleanValues } = valuesToSend;
    
    console.log("Creating salon with processed values:", cleanValues);
    
    const { data, error } = await supabase.functions.invoke("create-salon-account", {
      body: {
        ...cleanValues,
        skipSubscription: cleanValues.skipSubscription || false
      },
    });

    if (error) {
      console.error("Error from edge function:", error);
      throw error;
    }
    
    if (data.error) {
      console.error("Error response from edge function:", data.error);
      throw new Error(data.error);
    }
    
    console.log("Response from edge function:", data);
    
    // Skicka välkomstmejl till den nyligen skapade salongen
    if (data.salon && data.temporaryPassword) {
      console.log("Skickar välkomstmejl för ny salong:", data.salon.name);
      
      // Skapa prenumerationsinformation om tillgängligt
      const subscriptionInfo = data.salon.subscription_plan ? {
        plan: data.salon.subscription_plan,
        type: data.salon.subscription_type || "monthly",
        start_date: new Date().toISOString(),
        next_billing_date: data.salon.current_period_end
      } : undefined;
      
      const emailResult = await sendSalonWelcomeEmail({
        business_name: data.salon.name,
        email: data.salon.email,
        temporary_password: data.temporaryPassword,
        subscription_info: subscriptionInfo
      });
      
      if (!emailResult.success) {
        console.warn("Kunde inte skicka välkomstmejl:", emailResult.error);
        // Fortsätt ändå, salongen har skapats
      } else {
        console.log("Välkomstmejl skickat framgångsrikt");
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error creating salon:", error);
    throw error;
  }
};
