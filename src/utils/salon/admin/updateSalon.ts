
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
    console.log("Setting subscription values in updateValues:", {
      plan: values.subscriptionPlan,
      type: values.subscriptionType,
      skipSubscription: values.skipSubscription,
      endDate: values.subscriptionEndDate
    });
    
    updateValues.subscription_plan = values.subscriptionPlan || "Baspaket";
    updateValues.subscription_type = values.subscriptionType || "monthly";
    
    // Save skip_subscription value in database
    if (values.skipSubscription !== undefined) {
      updateValues.skip_subscription = values.skipSubscription;
      console.log("Setting skip_subscription to:", values.skipSubscription);
      
      // Om vi har skipSubscription och ett anpassat slutdatum
      if (values.skipSubscription && values.subscriptionEndDate) {
        updateValues.current_period_end = new Date(values.subscriptionEndDate);
        console.log("Setting custom end date for subscription:", updateValues.current_period_end);
      }
      // Om vi har skipSubscription utan anpassat slutdatum
      else if (values.skipSubscription) {
        // Set expiration date 10 years in the future for administrative salons
        updateValues.current_period_end = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
        console.log("Setting long future date for current_period_end due to skipSubscription=true");
      }
    }
    
    console.log("Final update values to send to database:", JSON.stringify(updateValues, null, 2));

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
      // Check if error is about missing skip_subscription column
      if (error.message && error.message.includes("skip_subscription")) {
        console.error("The skip_subscription column is missing from the salons table. Please add it using SQL.");
        console.error("Run: ALTER TABLE salons ADD COLUMN skip_subscription BOOLEAN DEFAULT false;");
        
        // Try again without the skip_subscription field
        delete updateValues.skip_subscription;
        console.log("Retrying update without skip_subscription field");
        
        const { data: retryData, error: retryError } = await supabase
          .from("salons")
          .update(updateValues)
          .eq("id", id)
          .select();
          
        if (retryError) {
          throw retryError;
        }
        
        console.log("Successfully updated salon without skip_subscription field:", retryData);
        return retryData;
      }
      throw error;
    }
    
    console.log("Salon updated successfully, response:", data);
    
    try {
      // Double-verify if the subscription plan was actually updated by fetching salon
      const { data: verifyData, error: verifyError } = await supabase
        .from("salons")
        .select("id, name, subscription_plan, subscription_type, skip_subscription, current_period_end")
        .eq("id", id)
        .single();
        
      if (verifyError) {
        console.warn("Could not verify update result:", verifyError);
      } else if (verifyData) {
        console.log("Verification of salon after update:", verifyData);
        
        if (verifyData.subscription_plan !== values.subscriptionPlan) {
          console.error("MISMATCH: Subscription plan was not updated correctly!");
          console.error(`Expected: ${values.subscriptionPlan}, Actual: ${verifyData.subscription_plan}`);
        } else {
          console.log("Subscription plan verified correctly:", verifyData.subscription_plan);
        }
        
        // Verify skip_subscription was saved correctly if it exists
        if ('skip_subscription' in verifyData) {
          console.log("Skip subscription value in database:", verifyData.skip_subscription);
          if (values.skipSubscription !== undefined && verifyData.skip_subscription !== values.skipSubscription) {
            console.error("MISMATCH: skip_subscription was not updated correctly!");
            console.error(`Expected: ${values.skipSubscription}, Actual: ${verifyData.skip_subscription}`);
          }
        } else {
          console.warn("skip_subscription column might not exist in the database");
        }
        
        // Verifiera även slutdatumet
        if (values.skipSubscription && values.subscriptionEndDate) {
          const expectedDate = new Date(values.subscriptionEndDate).toISOString();
          const actualDate = verifyData.current_period_end ? new Date(verifyData.current_period_end).toISOString() : null;
          console.log("End date verification:", { expected: expectedDate, actual: actualDate });
        }
      }
    } catch (verifyErr) {
      console.warn("Error during verification:", verifyErr);
    }
    
    return data;
  } catch (error) {
    console.error("Error updating salon:", error);
    throw error;
  }
};
