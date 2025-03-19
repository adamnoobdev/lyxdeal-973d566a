
import { useState, useRef } from "react";
import { Deal } from "@/components/admin/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function loadSalonDeals(
  salonId: string | undefined,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isLoadingDeals: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>,
  loadAttempts: React.MutableRefObject<number>
): Promise<void> {
  // Don't attempt to load if there's no salonId or we're already loading
  if (!salonId || isLoadingDeals.current) {
    return;
  }

  // Prevent multiple concurrent loading attempts
  isLoadingDeals.current = true;
  
  try {
    console.log(`[loadSalonDeals] Loading deals for salon ${salonId} (attempt ${loadAttempts.current + 1})`);
    
    // Convert salonId to number if it's a string
    const numericSalonId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('salon_id', numericSalonId);
    
    // Only update state if the component is still mounted
    if (isMountedRef.current) {
      if (error) {
        console.error('Error loading salon deals:', error);
        setError(`Failed to load deals: ${error.message}`);
        
        // After 3 failed attempts, show a toast
        if (loadAttempts.current >= 2) {
          toast.error('Problem med att hämta erbjudanden', {
            description: 'Vi kunde inte hämta dina erbjudanden. Försök igen senare.'
          });
        }
      } else {
        // Transform the data to ensure it matches the Deal type
        const typedDeals = data?.map(deal => ({
          ...deal,
          status: (deal.status as "pending" | "approved" | "rejected") || "pending",
          is_free: deal.is_free || false,
          is_active: deal.is_active || false
        })) as Deal[];
        
        setDeals(typedDeals || []);
        setError(null);
        console.log(`[loadSalonDeals] Successfully loaded ${data?.length || 0} deals for salon ${salonId}`);
      }
      
      setIsLoading(false);
    }
  } catch (err) {
    console.error('Unexpected error in loadSalonDeals:', err);
    
    if (isMountedRef.current) {
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
      
      if (loadAttempts.current >= 2) {
        toast.error('Problem med att hämta erbjudanden', {
          description: 'Ett oväntat fel uppstod. Försök igen senare.'
        });
      }
    }
  } finally {
    loadAttempts.current += 1;
    isLoadingDeals.current = false;
  }
}
