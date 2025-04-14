
import { supabase } from "@/integrations/supabase/client";

interface WelcomeEmailParams {
  business_name: string;
  email: string;
  temporary_password: string;
  subscription_info?: {
    plan: string;
    type: string;
    start_date: string;
    next_billing_date?: string;
  };
}

/**
 * Skickar välkomstmejl till en nyligen skapad salong
 */
export const sendSalonWelcomeEmail = async (params: WelcomeEmailParams): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> => {
  try {
    console.log("[sendSalonWelcomeEmail] Skickar välkomstmejl till:", params.email);
    
    // Format request and handle defaults
    const requestData = {
      business_name: params.business_name,
      email: params.email,
      temporary_password: params.temporary_password,
      subscription_info: params.subscription_info
    };
    
    console.log("[sendSalonWelcomeEmail] Förbereder anrop till edge-funktionen");
    
    // Anropa edge-funktionen för att skicka välkomstmejl
    const { data, error } = await supabase.functions.invoke("send-salon-welcome", {
      body: requestData
    });
    
    if (error) {
      console.error("[sendSalonWelcomeEmail] Fel vid anrop till edge-funktion:", error);
      return { success: false, error: error.message || "Kunde inte skicka välkomstmejl" };
    }
    
    console.log("[sendSalonWelcomeEmail] Välkomstmejl skickat, svar:", data);
    
    // Kontrollera svardata för eventuella API-fel
    if (data && data.error) {
      return {
        success: false,
        error: data.error,
        data
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error("[sendSalonWelcomeEmail] Exception:", error);
    return {
      success: false,
      error: error.message || "Ett okänt fel uppstod vid skickandet av välkomstmejl"
    };
  }
};
