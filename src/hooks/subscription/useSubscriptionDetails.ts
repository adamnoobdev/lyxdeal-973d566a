import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PurchaseDetails, SalonAccount } from "./types"; 

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

  const fetchPurchaseDetails = async () => {
    if (!sessionId) {
      console.warn("No session ID found in URL");
      setError("Inget sessionID hittades");
      setLoading(false);
      return false;
    }

    try {
      console.log("Fetching purchase details for session:", sessionId);
      console.log("Retry count:", retryCount);
      
      // First try: Look for partner request with this session ID
      const { data: sessionData, error: sessionError } = await supabase
        .from("partner_requests")
        .select("*")
        .eq("stripe_session_id", sessionId)
        .limit(1);
        
      if (sessionError) {
        console.error("Error checking session data:", sessionError);
        throw sessionError;
      }
      
      if (sessionData && sessionData.length > 0) {
        console.log("Found session data:", sessionData[0]);
        setPurchaseDetails(sessionData[0]);
        
        // Now check if this email has a salon account
        if (sessionData[0].email) {
          console.log("Checking for salon account with email:", sessionData[0].email);
          
          const { data: salonData, error: salonError } = await supabase
            .from("salons")
            .select("id, email, name")
            .eq("email", sessionData[0].email)
            .limit(1);
            
          if (salonError) {
            console.error("Error checking salon account:", salonError);
          } else if (salonData && salonData.length > 0) {
            console.log("Found salon account:", salonData[0]);
            // Only extract the fields we need for SalonAccount
            setSalonAccount({
              id: salonData[0].id,
              email: salonData[0].email,
              name: salonData[0].name
            });
            toast.success("Ditt salongskonto har skapats!");
            return true;
          } else {
            console.log("No salon account found yet with email:", sessionData[0].email);
            return false; // Signal to retry
          }
        }
      }
      
      // Second try: Look for recently approved partner requests
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
            .select("id, email, name")
            .eq("email", mostRecent.email)
            .limit(1);
            
          if (salonError) {
            console.error("Error checking salon account:", salonError);
          } else if (salonData && salonData.length > 0) {
            console.log("Found salon account:", salonData[0]);
            // Extract only the fields we need for SalonAccount
            setSalonAccount({
              id: salonData[0].id,
              email: salonData[0].email,
              name: salonData[0].name
            });
            toast.success("Ditt salongskonto har skapats!");
            return true;
          } else {
            console.log("No salon account found yet with email:", mostRecent.email);
            return false; // Signal to retry
          }
        }
      }
      
      console.log("No matching partner request or salon account found. Retry count:", retryCount);
      return false; // Signal to retry
    } catch (err) {
      console.error("Error fetching purchase details:", err);
      setError("Kunde inte hämta detaljer om din prenumeration");
      return true; // Error, but stop retrying
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading || isRetrying || (retryCount > 0 && !salonAccount)) {
      (async () => {
        const success = await fetchPurchaseDetails();
        
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
