import { supabase } from "@/integrations/supabase/client";

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
    
    // Add subscription plan and type if they exist
    if (values.subscriptionPlan && !values.skipSubscription) {
      valuesToSend.subscriptionPlan = values.subscriptionPlan;
      valuesToSend.subscriptionType = values.subscriptionType || "monthly";
      console.log("Using subscription plan:", valuesToSend.subscriptionPlan, "type:", valuesToSend.subscriptionType);
    }
    
    // Clean up fields we don't want to send to the edge function
    const { street, postalCode, city, fullAddress, ...cleanValues } = valuesToSend;
    
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
    
    return data;
  } catch (error) {
    console.error("Error creating salon:", error);
    throw error;
  }
};
