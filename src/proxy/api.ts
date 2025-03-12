
import { supabase } from "@/integrations/supabase/client";

export const createCheckoutSession = async (dealId: number, customerInfo: { 
  name: string; 
  email: string; 
  phone?: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke("checkout-deal", {
      body: { dealId, customerInfo },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
