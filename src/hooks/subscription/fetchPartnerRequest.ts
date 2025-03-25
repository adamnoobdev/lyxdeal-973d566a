
import { supabase } from "@/integrations/supabase/client";
import { PurchaseDetails, SalonAccount } from "./types";

// Hitta partner-förfrågan med ett specifikt session-ID
export const fetchPartnerRequestBySession = async (sessionId: string): Promise<PurchaseDetails | null> => {
  console.log("Söker partner-förfrågan med session ID:", sessionId);
  
  const { data, error } = await supabase
    .from("partner_requests")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .limit(1);
    
  if (error) {
    console.error("Fel vid sökning efter partner-förfrågan:", error);
    throw error;
  }
  
  if (data && data.length > 0) {
    console.log("Hittade partner-förfrågan:", data[0]);
    return data[0] as PurchaseDetails;
  }
  
  console.log("Ingen partner-förfrågan hittades med session ID:", sessionId);
  return null;
};

// Hitta de senaste godkända partner-förfrågningarna
export const fetchRecentApprovedPartnerRequests = async (): Promise<PurchaseDetails[]> => {
  console.log("Söker nyligen godkända partner-förfrågningar");
  
  const { data, error } = await supabase
    .from("partner_requests")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(10);
    
  if (error) {
    console.error("Fel vid sökning efter godkända partner-förfrågningar:", error);
    throw error;
  }
  
  console.log("Hittade godkända partner-förfrågningar:", data?.length || 0);
  return data as PurchaseDetails[] || [];
};

// Kontrollera om ett salongskonto finns för en specifik e-postadress
export const checkSalonAccount = async (email: string): Promise<SalonAccount | null> => {
  if (!email) return null;
  
  console.log("Söker salongskonto med e-post:", email);
  
  const { data, error } = await supabase
    .from("salons")
    .select("id, email, name")
    .eq("email", email)
    .limit(1);
    
  if (error) {
    console.error("Fel vid sökning efter salongskonto:", error);
    throw error;
  }
  
  if (data && data.length > 0) {
    console.log("Hittade salongskonto:", data[0]);
    return {
      id: data[0].id,
      email: data[0].email,
      name: data[0].name
    };
  }
  
  console.log("Inget salongskonto hittades med e-post:", email);
  return null;
};
