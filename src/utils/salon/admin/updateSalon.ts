
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates a salon in the database
 */
export const updateSalonData = async (values: any, id: number) => {
  try {
    // Log original values
    console.log("Updating salon with original values:", JSON.stringify(values, null, 2));
    
    // Create a clean object for updates
    const updateValues: Record<string, any> = {
      name: values.name,
      email: values.email, 
      phone: values.phone || ""
    };
    
    // Prioritize direct address field if it exists
    if (values.address) {
      updateValues.address = values.address;
      console.log("Using provided address:", values.address);
    }
    // Use fullAddress if it was set directly from MapboxAddressInput
    else if (values.fullAddress) {
      updateValues.address = values.fullAddress;
      console.log("Using full address from input:", values.fullAddress);
    }
    // Fall back to combining individual parts if needed
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
      
      if (fullAddress) {
        updateValues.address = fullAddress;
        console.log("Built address from parts:", updateValues.address);
      }
    }
    
    // Add terms acceptance info
    if (values.termsAccepted !== undefined) {
      updateValues.terms_accepted = values.termsAccepted;
    }
    
    if (values.privacyAccepted !== undefined) {
      updateValues.privacy_accepted = values.privacyAccepted;
    }
    
    // CRITICAL: Always include subscription fields in the update
    // The subscription_plan and subscription_type must always be included
    updateValues.subscription_plan = values.subscriptionPlan;
    updateValues.subscription_type = values.subscriptionType;
    
    console.log("Subscription plan to update:", values.subscriptionPlan);
    console.log("Subscription type to update:", values.subscriptionType);
    console.log("Final update values:", JSON.stringify(updateValues, null, 2));

    // If a new password is provided, update it via auth admin API
    if (values.password) {
      const { data: salon } = await supabase
        .from("salons")
        .select("user_id")
        .eq("id", id)
        .single();

      if (salon?.user_id) {
        const { error: passwordError } = await supabase.functions.invoke("update-salon-password", {
          body: { 
            userId: salon.user_id,
            newPassword: values.password
          }
        });

        if (passwordError) throw passwordError;
      }
    }

    // Update the salon record
    const { data, error } = await supabase
      .from("salons")
      .update(updateValues)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase error updating salon:", error);
      throw error;
    }
    
    console.log("Salon updated successfully, response:", data);
    
    // Double-verify if the subscription plan was actually updated by fetching salon
    const { data: verifyData, error: verifyError } = await supabase
      .from("salons")
      .select("id, name, subscription_plan, subscription_type")
      .eq("id", id)
      .single();
      
    if (verifyError) {
      console.warn("Could not verify update result:", verifyError);
    } else {
      console.log("Verification of salon after update:", verifyData);
      if (verifyData.subscription_plan !== values.subscriptionPlan) {
        console.error("MISMATCH: Subscription plan was not updated correctly!");
        console.error(`Expected: ${values.subscriptionPlan}, Actual: ${verifyData.subscription_plan}`);
      } else {
        console.log("Subscription plan verified correctly:", verifyData.subscription_plan);
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error updating salon:", error);
    throw error;
  }
};
