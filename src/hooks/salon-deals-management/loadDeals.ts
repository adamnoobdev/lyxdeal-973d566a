
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { RefObject } from "react";

export const loadSalonDeals = async (
  salonId: string | undefined,
  setDeals: (deals: Deal[]) => void,
  setError: (error: string | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  isLoadingDeals: { current: boolean },
  isMountedRef: { current: boolean },
  loadAttempts: { current: number }
): Promise<boolean> => {
  if (!salonId) {
    setError("Salong-ID saknas");
    setIsLoading(false);
    return false;
  }

  if (isLoadingDeals.current) {
    console.log("[loadSalonDeals] Already loading deals, skipping");
    return false;
  }

  // Increment attempt counter
  loadAttempts.current = loadAttempts.current + 1;
  
  try {
    isLoadingDeals.current = true;
    
    if (isMountedRef.current) {
      setIsLoading(true);
      setError(null);
    }

    console.log(`[loadSalonDeals] Loading deals for salon: ${salonId}, attempt: ${loadAttempts.current}`);

    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('salon_id', parseInt(salonId, 10))
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[loadSalonDeals] Error loading deals:", error);
      
      // Only show toast on first few attempts to avoid spamming
      if (loadAttempts.current <= 3) {
        toast.error("Kunde inte ladda erbjudanden");
      }
      
      if (isMountedRef.current) {
        setError("Kunde inte ladda erbjudanden");
        setIsLoading(false);
      }
      return false;
    }

    console.log(`[loadSalonDeals] Successfully loaded ${data?.length || 0} deals`);
    
    if (isMountedRef.current) {
      // Ensure data conforms to Deal type before setting
      const dealsWithStatus = (data || []).map(deal => ({
        ...deal,
        status: deal.status || "approved" // Default to approved if no status
      } as Deal));
      
      setDeals(dealsWithStatus);
      setIsLoading(false);
      loadAttempts.current = 0; // Reset counter on success
    }
    return true;
  } catch (error) {
    console.error("[loadSalonDeals] Error in load operation:", error);
    
    if (loadAttempts.current <= 3) {
      toast.error("Ett fel uppstod när erbjudanden skulle laddas");
    }
    
    if (isMountedRef.current) {
      setError("Ett fel uppstod när erbjudanden skulle laddas");
      setIsLoading(false);
    }
    return false;
  } finally {
    isLoadingDeals.current = false;
  }
};
