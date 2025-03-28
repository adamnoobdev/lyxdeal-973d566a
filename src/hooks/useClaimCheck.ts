
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for checking if a user has already claimed a deal
 */
export const useClaimCheck = (dealId: number) => {
  const [hasAlreadyClaimed, setHasAlreadyClaimed] = useState(false);
  const [isCheckingClaim, setIsCheckingClaim] = useState(true);

  useEffect(() => {
    const checkIfAlreadyClaimed = async () => {
      try {
        setIsCheckingClaim(true);
        // Kolla om det finns tidigare anspråk baserat på IP/browser fingerprint
        const storedClaims = localStorage.getItem('claimed_deals') || '[]';
        const claimedDeals = JSON.parse(storedClaims);
        
        if (claimedDeals.includes(dealId.toString())) {
          setHasAlreadyClaimed(true);
          setIsCheckingClaim(false);
          return;
        }

        // Kolla även i databasen efter tidigare anspråk
        const { data: existingClaims, error } = await supabase
          .from("discount_codes")
          .select("id")
          .eq("deal_id", dealId)
          .eq("is_used", true)
          .limit(1);

        if (error) {
          console.error("Error checking existing claims:", error);
          setIsCheckingClaim(false);
          return;
        }

        // Om användaren tidigare har använt en rabattkod för detta erbjudande
        if (existingClaims && existingClaims.length > 0) {
          const claimedIPAddress = localStorage.getItem('claimed_from_ip') || '';
          const { data: ipMatch } = await supabase.functions.invoke("check-previous-claims", {
            body: { 
              dealId, 
              previousIP: claimedIPAddress 
            }
          });
          
          if (ipMatch && ipMatch.isSameDevice) {
            setHasAlreadyClaimed(true);
          }
        }
      } catch (error) {
        console.error("Error checking claims:", error);
      } finally {
        setIsCheckingClaim(false);
      }
    };

    checkIfAlreadyClaimed();
  }, [dealId]);

  return {
    hasAlreadyClaimed,
    isCheckingClaim
  };
};
