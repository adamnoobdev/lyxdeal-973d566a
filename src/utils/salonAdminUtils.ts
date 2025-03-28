
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Fetches all salons data from the database
 */
export const fetchSalonsData = async () => {
  try {
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching salons:", error);
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
    // Rensa upp och hantera adressfält innan de skickas
    const { street, postalCode, city, ...otherValues } = values;
    
    // Kombinera adressfälten till fullständig adress om de finns
    if (street || postalCode || city) {
      let fullAddress = '';
      if (street) fullAddress += street;
      if (postalCode) {
        if (fullAddress) fullAddress += ', ';
        fullAddress += postalCode;
      }
      if (city) {
        if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
        fullAddress += city;
      }
      
      values = {
        ...otherValues,
        address: fullAddress || undefined
      };
    }
    
    console.log("Creating salon with values:", values);
    const { data, error } = await supabase.functions.invoke("create-salon-account", {
      body: {
        ...values,
        skipSubscription: values.skipSubscription || false
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
    // Rensa upp och hantera adressfält innan de skickas
    const { street, postalCode, city, password, skipSubscription, ...otherValues } = values;
    
    // Kombinera adressfälten till fullständig adress om de finns
    if (street || postalCode || city) {
      let fullAddress = '';
      if (street) fullAddress += street;
      if (postalCode) {
        if (fullAddress) fullAddress += ', ';
        fullAddress += postalCode;
      }
      if (city) {
        if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
        fullAddress += city;
      }
      
      otherValues.address = fullAddress || undefined;
    }
    
    // If a new password is provided, update it via auth admin API
    if (password) {
      const { data: salon } = await supabase
        .from("salons")
        .select("user_id")
        .eq("id", id)
        .single();

      if (salon?.user_id) {
        const { error: passwordError } = await supabase.functions.invoke("update-salon-password", {
          body: { 
            userId: salon.user_id,
            newPassword: password
          }
        });

        if (passwordError) throw passwordError;
      }
    }

    console.log("Updating salon with values:", otherValues);

    const { error } = await supabase
      .from("salons")
      .update(otherValues)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating salon:", error);
    throw error;
  }
};
