
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PurchaseDetails {
  id?: string;
  business_name: string;
  email: string;
  plan_title?: string;
  plan_payment_type?: string;
  status?: string;
  created_at?: string;
}

export interface SalonAccount {
  id: number; // Changed from string to number to match the database structure
  email: string;
  name?: string;
}

export const useSubscriptionDetails = (sessionId: string | null) => {
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [salonAccount, setSalonAccount] = useState<SalonAccount | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const maxRetries = 20;
  const retryDelay = 3000;

  const manualRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    toast.info("Kontrollerar kontostatus...");
  };

  // Fetch purchase details and check salon account status
  const fetchPurchaseDetails = async () => {
    if (!sessionId) {
      console.warn("No session ID found in URL");
      setError("Inget sessionID hittades");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching purchase details for session:", sessionId);
      console.log("Retry count:", retryCount);
      
      // Try to find the most recent partner request that's been approved
      const { data: partnerRequests, error: partnerError } = await supabase
        .from("partner_requests")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(10);

      if (partnerError) {
        console.error("Error fetching partner requests:", partnerError);
        throw partnerError;
      }

      console.log("Found partner requests:", partnerRequests?.length || 0);
      
      if (partnerRequests && partnerRequests.length > 0) {
        // Find the most recently approved partner request
        const mostRecent = partnerRequests[0];
        setPurchaseDetails(mostRecent);
        console.log("Found partner request:", mostRecent);
        
        // Check if a salon account exists for this email
        if (mostRecent.email) {
          console.log("Checking for salon account with email:", mostRecent.email);
          
          // Try to find a matching salon with the email
          const { data: salonData, error: salonError } = await supabase
            .from("salons")
            .select("*")
            .eq("email", mostRecent.email)
            .limit(1);
            
          if (salonError) {
            console.error("Error checking salon account:", salonError);
          } else if (salonData && salonData.length > 0) {
            console.log("Found salon account:", salonData[0].id);
            // Extract only the fields we need for SalonAccount
            setSalonAccount({
              id: salonData[0].id,
              email: salonData[0].email,
              name: salonData[0].name
            });
            toast.success("Ditt salongskonto har skapats!");
          } else {
            console.log("No salon account found yet with email:", mostRecent.email);
            
            // Extra check - check if there's any partner request with this session ID
            console.log("Checking for partner request with session ID:", sessionId);
            const { data: sessionData, error: sessionError } = await supabase
              .from("partner_requests")
              .select("*")
              .eq("stripe_session_id", sessionId)
              .limit(1);
              
            if (sessionError) {
              console.error("Error checking session data:", sessionError);
            } else if (sessionData && sessionData.length > 0) {
              console.log("Found session data:", sessionData[0]);
              // Update our purchase details if we found a match
              setPurchaseDetails(sessionData[0]);
            } else {
              console.log("No partner request found with this session ID");
            }
            
            return false; // Signal to retry
          }
        }
      } else {
        console.log("No approved partner requests found. Retry count:", retryCount);
        
        // Extra check - try to find any partner request with this session ID
        console.log("Checking for any partner request with session ID:", sessionId);
        const { data: sessionData, error: sessionError } = await supabase
          .from("partner_requests")
          .select("*")
          .eq("stripe_session_id", sessionId)
          .limit(1);
          
        if (sessionError) {
          console.error("Error checking session data:", sessionError);
        } else if (sessionData && sessionData.length > 0) {
          console.log("Found session data:", sessionData[0]);
          // Update our purchase details
          setPurchaseDetails(sessionData[0]);
          
          // Check if this email has a salon account already
          if (sessionData[0].email) {
            const { data: salonCheck, error: salonCheckError } = await supabase
              .from("salons")
              .select("*")
              .eq("email", sessionData[0].email)
              .limit(1);
              
            if (salonCheckError) {
              console.error("Error checking salon account:", salonCheckError);
            } else if (salonCheck && salonCheck.length > 0) {
              console.log("Found salon account:", salonCheck[0].id);
              setSalonAccount({
                id: salonCheck[0].id,
                email: salonCheck[0].email,
                name: salonCheck[0].name
              });
              toast.success("Ditt salongskonto har skapats!");
              return true; // Success!
            }
          }
        } else {
          console.log("No partner request found with this session ID either");
        }
        
        return false; // Signal to retry
      }
      
      return true; // Success, no need to retry
    } catch (err) {
      console.error("Error fetching purchase details:", err);
      setError("Kunde inte hämta detaljer om din prenumeration");
      return true; // Error, but stop retrying
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  // Start timer to track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Set up retry logic
  useEffect(() => {
    if (loading || isRetrying || (retryCount > 0 && !salonAccount)) {
      (async () => {
        const success = await fetchPurchaseDetails();
        
        // If no salon account was found and we haven't exceeded max retries, try again
        if (!success && retryCount < maxRetries) {
          const timer = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            setIsRetrying(false);
          }, retryDelay);
          
          return () => clearTimeout(timer);
        } else if (!success && retryCount >= maxRetries) {
          console.warn("Max retries reached, still no salon account found");
          toast.error("Kunde inte hitta ditt salongskonto efter flera försök. Vänligen kontakta kundtjänst.");
        }
      })();
    }
  }, [sessionId, retryCount, loading, isRetrying, salonAccount]);

  return {
    purchaseDetails,
    salonAccount,
    loading,
    error,
    retryCount,
    isRetrying,
    timeElapsed,
    manualRetry,
    maxRetries
  };
};

export const formatDate = (date: Date | string | null) => {
  if (!date) return "Okänt datum";
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('sv-SE');
};
