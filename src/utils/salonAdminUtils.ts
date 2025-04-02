
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchAllSalons } from "./salon/queries";

/**
 * Fetches all salons data from the database
 */
export const fetchSalonsData = async () => {
  try {
    console.log("Hämtar salonger via fetchSalonsData()");
    
    // Försök först med fetchAllSalons från queries
    try {
      const salonsData = await fetchAllSalons();
      if (salonsData && salonsData.length > 0) {
        console.log("Hämtade salonger via fetchAllSalons, antal:", salonsData.length);
        return salonsData;
      }
    } catch (e) {
      console.warn("Kunde inte hämta via fetchAllSalons, försöker med direkt Supabase anrop", e);
    }
    
    // Fallback till direkt Supabase anrop
    console.log("Försöker med direkt Supabase anrop");
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching salons via direct query:", error);
      throw error;
    }
    
    console.log("Hämtade salonger via direkt Supabase anrop, antal:", data?.length || 0);
    return data;
  } catch (error) {
    console.error("Error i fetchSalonsData:", error);
    throw error;
  }
};

/**
 * Checks if a salon has any deals
 */
export const checkSalonHasDeals = async (id: number) => {
  const { data, error } = await supabase
    .from("deals")
    .select("id")
    .eq("salon_id", id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0;
};

/**
 * Deletes a salon from the database
 */
export const deleteSalonData = async (id: number) => {
  const { error } = await supabase
    .from("salons")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

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

/**
 * Updates a salon in the database
 */
export const updateSalonData = async (values: any, id: number) => {
  try {
    // Log original values
    console.log("Updating salon with original values:", values);
    
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
    
    console.log("Updating salon with processed values:", updateValues);

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
    const { error } = await supabase
      .from("salons")
      .update(updateValues)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating salon:", error);
    throw error;
  }
};
