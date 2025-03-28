
import { useState, useEffect, useCallback } from "react";
import { PurchaseDetails, SalonAccount } from "./types";
import { fetchPartnerRequestBySession, fetchRecentApprovedPartnerRequests, checkSalonAccount } from "./fetchPartnerRequest";
import { toast } from "sonner";

interface UseSubscriptionPollingProps {
  sessionId: string | null;
  maxRetries?: number;
  retryDelay?: number;
}

interface UseSubscriptionPollingResult {
  purchaseDetails: PurchaseDetails | null;
  salonAccount: SalonAccount | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  isRetrying: boolean;
  manualRetry: () => void;
}

export const useSubscriptionPolling = ({
  sessionId,
  maxRetries = 20,
  retryDelay = 3000
}: UseSubscriptionPollingProps): UseSubscriptionPollingResult => {
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [salonAccount, setSalonAccount] = useState<SalonAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Main function for fetching data and checking account status
  const fetchSubscriptionData = useCallback(async (): Promise<boolean> => {
    if (!sessionId) {
      console.warn("No session ID found in URL");
      setLoading(false);
      // We're not setting an error here anymore since we want to show the success page anyway
      return false;
    }

    try {
      console.log("Fetching subscription details for session:", sessionId);
      console.log("Retry count:", retryCount);
      
      // Strategy 1: Look for partner request with session ID
      let partnerRequest = await fetchPartnerRequestBySession(sessionId);
      
      // If we found a request with this session ID
      if (partnerRequest) {
        setPurchaseDetails(partnerRequest);
        
        // Check if email has a salon account
        if (partnerRequest.email) {
          const account = await checkSalonAccount(partnerRequest.email);
          
          if (account) {
            setSalonAccount(account);
            toast.success("Your salon account has been created!");
            return true;
          }
          
          return false; // Need to continue checking
        }
      }
      
      // Strategy 2: Look for recently approved partner requests
      const recentRequests = await fetchRecentApprovedPartnerRequests();
      
      if (recentRequests.length > 0) {
        // Use the most recent approved request
        const mostRecent = recentRequests[0];
        setPurchaseDetails(mostRecent);
        
        // Check if a salon account exists for this email
        if (mostRecent.email) {
          const account = await checkSalonAccount(mostRecent.email);
          
          if (account) {
            setSalonAccount(account);
            toast.success("Your salon account has been created!");
            return true;
          }
          
          return false; // Need to continue checking
        }
      }
      
      console.log("No matching partner request or salon account found. Retry count:", retryCount);
      // Even if we don't find a match, we still want to show the success page
      return false; // Need to continue checking
    } catch (err) {
      console.error("Error fetching subscription details:", err);
      setError("Could not retrieve your subscription details");
      return true; // Error, but stop retrying
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [sessionId, retryCount]);

  // Function for manual retry
  const manualRetry = useCallback(() => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    toast.info("Checking account status...");
  }, []);

  // Set up initial check and retry logic
  useEffect(() => {
    if (loading || isRetrying || (retryCount > 0 && !salonAccount)) {
      (async () => {
        const success = await fetchSubscriptionData();
        
        // If no salon account was found and we haven't exceeded max retries, try again
        if (!success && retryCount < maxRetries) {
          const timer = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            setIsRetrying(false);
          }, retryDelay);
          
          return () => clearTimeout(timer);
        } else if (!success && retryCount >= maxRetries) {
          console.warn("Max retries reached, still no salon account found");
          toast.error("Could not find your salon account after multiple attempts. Please contact customer support.");
        }
      })();
    }
  }, [fetchSubscriptionData, loading, isRetrying, maxRetries, retryCount, retryDelay, salonAccount]);

  return {
    purchaseDetails,
    salonAccount,
    loading,
    error,
    retryCount,
    isRetrying,
    manualRetry
  };
};
