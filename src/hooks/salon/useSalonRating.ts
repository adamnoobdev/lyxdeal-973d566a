
import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for handling salon rating operations
 */
export const useSalonRating = (
  fetchSalons: () => Promise<void>,
  isMountedRef: React.MutableRefObject<boolean>,
  setIsRating: (value: boolean) => void,
  setRatingSalon: (salon: any | null) => void
) => {
  // Reference to track if an operation is in progress
  const actionInProgressRef = useRef(false);

  /**
   * Handle salon rating with action tracking
   */
  const onRate = useCallback(async (salonId: number, rating: number, comment: string) => {
    try {
      if (actionInProgressRef.current) {
        console.log("[useSalonRating] Rating operation already in progress");
        return false;
      }
      
      actionInProgressRef.current = true;
      setIsRating(true);
      
      // Ensure rating is properly formatted (up to 1 decimal place)
      const formattedRating = Math.round(rating * 10) / 10;
      
      console.log("[useSalonRating] Rating salon:", salonId, "rating:", formattedRating, "comment:", comment);
      
      // Convert to integer in database by multiplying by 10 (store 4.7 as 47)
      const dbRating = Math.round(formattedRating * 10);
      
      console.log("[useSalonRating] Storing rating in database as:", dbRating);
      
      // Update the salon's rating - store as integer by multiplying by 10
      const { error: updateError } = await supabase
        .from('salons')
        .update({ 
          rating: dbRating,
          rating_comment: comment
        })
        .eq('id', salonId);
      
      if (updateError) {
        console.error("[useSalonRating] Error updating salon rating:", updateError);
        toast.error("Kunde inte spara betyg");
        return false;
      }
      
      // Add to rating history - also store as integer
      const { error: ratingError } = await supabase
        .from('salon_ratings')
        .insert({
          salon_id: salonId,
          rating: dbRating,
          comment: comment,
          created_by: 'admin'
        });
          
      if (ratingError) {
        console.warn("[useSalonRating] Could not save rating history:", ratingError);
        // Continue execution even if history saving fails
      }
      
      // Update local salon data
      console.log("[useSalonRating] Rating saved, fetching updated salon data...");
      await fetchSalons();
      
      if (isMountedRef.current) {
        setRatingSalon(null);
      }
      
      toast.success("Betyg sparat");
      return true;
    } catch (error) {
      console.error("[useSalonRating] Error in rating salon:", error);
      toast.error("Ett fel uppstod när betyget skulle sparas");
      return false;
    } finally {
      actionInProgressRef.current = false;
      if (isMountedRef.current) {
        setIsRating(false);
      }
    }
  }, [fetchSalons, isMountedRef, setIsRating, setRatingSalon]);

  return {
    onRate
  };
};
