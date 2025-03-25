
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

  // Huvudfunktion för att hämta data och kontrollera kontostatus
  const fetchSubscriptionData = useCallback(async (): Promise<boolean> => {
    if (!sessionId) {
      console.warn("Inget session-ID hittades i URL:en");
      setError("Inget sessionID hittades");
      setLoading(false);
      return false;
    }

    try {
      console.log("Hämtar prenumerationsdetaljer för session:", sessionId);
      console.log("Försök nr:", retryCount);
      
      // Strategi 1: Sök efter partner-förfrågan med session-ID
      let partnerRequest = await fetchPartnerRequestBySession(sessionId);
      
      // Om vi hittade en förfrågan med detta session-ID
      if (partnerRequest) {
        setPurchaseDetails(partnerRequest);
        
        // Kontrollera om e-postadressen har ett salongskonto
        if (partnerRequest.email) {
          const account = await checkSalonAccount(partnerRequest.email);
          
          if (account) {
            setSalonAccount(account);
            toast.success("Ditt salongskonto har skapats!");
            return true;
          }
          
          return false; // Behöver fortsätta kontrollera
        }
      }
      
      // Strategi 2: Sök efter nyligen godkända partner-förfrågningar
      const recentRequests = await fetchRecentApprovedPartnerRequests();
      
      if (recentRequests.length > 0) {
        // Använd den senaste godkända förfrågan
        const mostRecent = recentRequests[0];
        setPurchaseDetails(mostRecent);
        
        // Kontrollera om det finns ett salongskonto för denna e-post
        if (mostRecent.email) {
          const account = await checkSalonAccount(mostRecent.email);
          
          if (account) {
            setSalonAccount(account);
            toast.success("Ditt salongskonto har skapats!");
            return true;
          }
          
          return false; // Behöver fortsätta kontrollera
        }
      }
      
      console.log("Ingen matchande partner-förfrågan eller salongskonto hittades. Försök nr:", retryCount);
      return false; // Behöver fortsätta kontrollera
    } catch (err) {
      console.error("Fel vid hämtning av prenumerationsdetaljer:", err);
      setError("Kunde inte hämta detaljer om din prenumeration");
      return true; // Fel uppstod, men sluta försöka
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [sessionId, retryCount]);

  // Funktion för manuell omförsök
  const manualRetry = useCallback(() => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    toast.info("Kontrollerar kontostatus...");
  }, []);

  // Starta initial kontroll och inställning av återförsök
  useEffect(() => {
    if (loading || isRetrying || (retryCount > 0 && !salonAccount)) {
      (async () => {
        const success = await fetchSubscriptionData();
        
        // Om inget salongskonto hittades och vi inte har överskridit max antal försök, försök igen
        if (!success && retryCount < maxRetries) {
          const timer = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            setIsRetrying(false);
          }, retryDelay);
          
          return () => clearTimeout(timer);
        } else if (!success && retryCount >= maxRetries) {
          console.warn("Maximalt antal försök uppnått, fortfarande inget salongskonto hittat");
          toast.error("Kunde inte hitta ditt salongskonto efter flera försök. Vänligen kontakta kundtjänst.");
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
