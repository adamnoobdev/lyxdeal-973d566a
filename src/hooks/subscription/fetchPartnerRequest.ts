import { supabase } from "@/integrations/supabase/client";
import { PurchaseDetails, SalonAccount } from "./types";

// Fetch partner request by session ID
export const fetchPartnerRequestBySession = async (sessionId: string): Promise<PurchaseDetails | null> => {
  console.log("Searching for partner request with session ID:", sessionId);
  
  const { data, error } = await supabase
    .from("partner_requests")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .limit(1);
    
  if (error) {
    console.error("Error fetching partner request:", error);
    throw error;
  }
  
  if (data && data.length > 0) {
    console.log("Found partner request:", data[0]);
    return data[0] as PurchaseDetails;
  }
  
  console.log("No partner request found with session ID:", sessionId);
  return null;
};

// Fetch recently approved partner requests
export const fetchRecentApprovedPartnerRequests = async (): Promise<PurchaseDetails[]> => {
  console.log("Searching for recently approved partner requests");
  
  const { data, error } = await supabase
    .from("partner_requests")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(10);
    
  if (error) {
    console.error("Error fetching approved partner requests:", error);
    throw error;
  }
  
  console.log("Found approved partner requests:", data?.length || 0);
  return data as PurchaseDetails[] || [];
};

// Check if a salon account exists for a specific email
export const checkSalonAccount = async (email: string): Promise<SalonAccount | null> => {
  if (!email) return null;
  
  console.log("Searching for salon account with email:", email);
  
  const { data, error } = await supabase
    .from("salons")
    .select("id, email, name, user_id")
    .eq("email", email)
    .limit(1);
    
  if (error) {
    console.error("Error checking salon account:", error);
    throw error;
  }
  
  if (data && data.length > 0) {
    console.log("Found salon account:", data[0]);
    
    // Check if account has a user_id (auth user linked)
    if (data[0].user_id) {
      console.log("Salon account has linked auth user:", data[0].user_id);
      return {
        id: data[0].id,
        email: data[0].email,
        name: data[0].name,
        isComplete: true
      };
    } else {
      console.log("Salon account found but no auth user linked");
      return {
        id: data[0].id,
        email: data[0].email,
        name: data[0].name,
        isComplete: false
      };
    }
  }
  
  console.log("No salon account found with email:", email);
  return null;
};

// Explicitly check if auth account exists
export const checkAuthUserExists = async (email: string): Promise<boolean> => {
  if (!email) return false;
  
  try {
    // We'll try to use the auth API to see if we can get sign-in methods
    // This is an indirect way to check if a user exists without admin privileges
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false
      }
    });
    
    // If this error contains "User not found", the user doesn't exist
    if (error && error.message.includes("not found")) {
      console.log("Auth user does not exist for email:", email);
      return false;
    }
    
    // Otherwise, assume user exists (we might get other errors like rate limiting)
    console.log("Auth user likely exists for email:", email);
    return true;
  } catch (err) {
    console.error("Error checking auth user:", err);
    return false;
  }
};
