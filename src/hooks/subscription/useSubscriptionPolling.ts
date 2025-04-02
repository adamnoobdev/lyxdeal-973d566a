
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PurchaseDetails, SalonAccount } from "./types";
import { 
  fetchPartnerRequestBySession, 
  fetchRecentApprovedPartnerRequests,
  checkSalonAccount 
} from "./fetchPartnerRequest";

export interface UseSubscriptionPollingProps {
  sessionId: string | null;
  initialLoading?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface UseSubscriptionPollingResult {
  purchaseDetails: PurchaseDetails | null;
  salonAccount: SalonAccount | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  isRetrying: boolean;
  manualRetry: () => void;
  maxRetries: number;
}

export const useSubscriptionPolling = ({
  sessionId,
  initialLoading = true,
  maxRetries = 20,
  retryDelay = 3000
}: UseSubscriptionPollingProps): UseSubscriptionPollingResult => {
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [salonAccount, setSalonAccount] = useState<SalonAccount | null>(null);

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
      const partnerRequest = await fetchPartnerRequestBySession(sessionId);
      
      if (partnerRequest) {
        console.log("Found session data:", partnerRequest);
        setPurchaseDetails(partnerRequest);
        
        // Now check if this email has a salon account
        if (partnerRequest.email) {
          const salonData = await checkSalonAccount(partnerRequest.email);
          
          if (salonData) {
            console.log("Found salon account:", salonData);
            setSalonAccount(salonData);
            toast.success("Ditt salongskonto har skapats!");
            return true;
          } else {
            console.log("No salon account found yet with email:", partnerRequest.email);
            return false; // Signal to retry
          }
        }
      }
      
      // Second try: Look for recently approved partner requests
      const partnerRequests = await fetchRecentApprovedPartnerRequests();

      console.log("Found partner requests:", partnerRequests?.length || 0);
      
      if (partnerRequests && partnerRequests.length > 0) {
        // Find the most recently approved partner request
        const mostRecent = partnerRequests[0];
        setPurchaseDetails(mostRecent);
        console.log("Found partner request:", mostRecent);
        
        // Check if a salon account exists for this email
        if (mostRecent.email) {
          const salonData = await checkSalonAccount(mostRecent.email);
          
          if (salonData) {
            console.log("Found salon account:", salonData);
            setSalonAccount(salonData);
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
    manualRetry,
    maxRetries
  };
};
