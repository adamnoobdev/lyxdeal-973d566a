
import { supabase } from "@/integrations/supabase/client";
import { SalonData } from "../types";
import { directFetch } from "./directFetch";

/**
 * Hämtar alla salonger
 */
export const fetchAllSalons = async (): Promise<SalonData[] | null> => {
  try {
    console.log("[fetchAllSalons] Hämtar alla salonger");
    
    // Prioritera direkthämtning via API utan autentisering
    console.log("[fetchAllSalons] Försöker direkthämta alla salonger");
    
    const directData = await directFetch<SalonData>(
      `salons`,
      { "select": "id,name,address,phone,email,created_at,user_id,role,subscription_plan,subscription_type,stripe_customer_id,stripe_subscription_id,current_period_end,status,cancel_at_period_end,terms_accepted,privacy_accepted,rating,rating_comment" }
    );
    
    if (directData && directData.length > 0) {
      console.log("[fetchAllSalons] Hämtade salonger via direkthämtning, antal:", directData.length);
      return directData as SalonData[];
    } else {
      console.log("[fetchAllSalons] Ingen data hittades via direkthämtning");
    }
    
    // Fallback till Supabase klient
    console.log("[fetchAllSalons] Försöker hämta via Supabase klient");
    
    const { data: salonData, error: salonError, status } = await supabase
      .from("salons")
      .select("*")
      .order('id', { ascending: true });
    
    console.log("[fetchAllSalons] Supabase förfrågan status:", status);
      
    if (salonError) {
      console.error("[fetchAllSalons] Fel vid hämtning:", salonError);
      throw salonError;
    }
    
    if (!salonData || salonData.length === 0) {
      console.log("[fetchAllSalons] Inga salonger hittades via Supabase klient");
      return [];
    }
    
    console.log("[fetchAllSalons] Hämtade salonger via Supabase klient, antal:", salonData.length);
    return salonData as SalonData[];
  } catch (err) {
    console.error("[fetchAllSalons] Undantag vid hämtning:", err);
    throw err;
  }
};
