
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook för att kontrollera om en användare redan har säkrat ett erbjudande
 */
export const useClaimCheck = (dealId: number) => {
  const [hasAlreadyClaimed, setHasAlreadyClaimed] = useState(false);
  const [isCheckingClaim, setIsCheckingClaim] = useState(true);

  useEffect(() => {
    const checkIfAlreadyClaimed = async () => {
      try {
        setIsCheckingClaim(true);
        
        // Kontrollera lokalt sparade anspråk först (snabbare)
        const storedClaims = localStorage.getItem('claimed_deals') || '[]';
        const claimedDeals = JSON.parse(storedClaims);
        
        if (claimedDeals.includes(dealId.toString())) {
          setHasAlreadyClaimed(true);
          setIsCheckingClaim(false);
          return;
        }

        // Om inget lokalt anspråk, kolla databasen
        const { data: existingClaims, error } = await supabase
          .from("discount_codes")
          .select("id")
          .eq("deal_id", dealId)
          .eq("is_used", true)
          .limit(1);

        if (error) {
          console.error("Error checking existing claims:", error);
        } else if (existingClaims && existingClaims.length > 0) {
          // Endast kontrollera tidigare IP om vi hittade användningskoder
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
