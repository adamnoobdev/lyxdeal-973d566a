
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function updatePartnerRequest(supabaseUrl: string, supabaseKey: string, email: string, sessionId: string, planTitle: string, planType: string, price: number) {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials for partner request update");
    return { success: false, error: "Missing credentials" };
  }

  try {
    console.log("Attempting to update partner_requests table with session ID");
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Först, leta efter en befintlig partner request
    const { data: existingData, error: existingError } = await supabase
      .from("partner_requests")
      .select("id, email")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);
      
    if (existingError) {
      console.error("Error finding existing partner request:", existingError);
      return { success: false, error: existingError.message };
    } 
    
    if (existingData && existingData.length > 0) {
      console.log("Found existing partner request to update:", existingData[0].id);
      
      // Update existing partner request with session ID
      const { data, error } = await supabase
        .from("partner_requests")
        .update({ 
          stripe_session_id: sessionId,
          plan_title: planTitle,
          plan_payment_type: planType,
          plan_price: price
        })
        .eq("id", existingData[0].id)
        .select();
        
      if (error) {
        console.error("Error updating partner request with session ID:", error);
        return { success: false, error: error.message };
      } 
      
      console.log("Successfully updated partner request with session ID");
      return { success: true, updated: true, data };
    } 
    
    console.log("No existing partner request found, creating a new one");
    
    // Create a new partner request with the session ID
    const { data: newData, error: newError } = await supabase
      .from("partner_requests")
      .insert([
        {
          name: businessName,
          business_name: businessName,
          email: email,
          phone: "Unknown", // Saknar telefonnummer men behöver fylla i ett värde
          stripe_session_id: sessionId,
          plan_title: planTitle,
          plan_payment_type: planType,
          plan_price: price
        }
      ])
      .select();
      
    if (newError) {
      console.error("Error creating new partner request with session ID:", newError);
      return { success: false, error: newError.message };
    } 
    
    console.log("Successfully created new partner request with session ID");
    return { success: true, created: true, data: newData };
  } catch (updateError) {
    console.error("Failed to update partner request with session ID:", updateError);
    return { success: false, error: updateError.message };
  }
}
