
import { useState, useEffect, useCallback, useRef } from "react";
import { Salon, SalonFormValues } from "@/components/admin/types";
import { useSalonsAdmin } from "@/hooks/useSalonsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for managing salon list state and operations
 */
export const useSalonsList = () => {
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [deletingSalon, setDeletingSalon] = useState<Salon | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [ratingSalon, setRatingSalon] = useState<Salon | null>(null);
  const [isRating, setIsRating] = useState(false);
  const isMountedRef = useRef(true);
  const actionInProgressRef = useRef(false);
  
  const { salons, isLoading, error, handleDelete, handleUpdate, handleCreate, fetchSalons } = useSalonsAdmin();

  // Ensure component is mounted
  useEffect(() => {
    isMountedRef.current = true;
    console.log("[useSalonsList] Hook initialized");
    
    return () => { 
      console.log("[useSalonsList] Hook cleanup");
      isMountedRef.current = false; 
    };
  }, []);

  // Fetch salons when component mounts
  useEffect(() => {
    console.log("[useSalonsList] Fetching salons data...");
    fetchSalons();
  }, [fetchSalons]);

  // Safe state setter for component unmount protection
  const safeSetState = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  /**
   * Handle salon deletion with action tracking
   */
  const onDelete = async () => {
    if (deletingSalon && !actionInProgressRef.current) {
      try {
        actionInProgressRef.current = true;
        console.log("[useSalonsList] Deleting salon:", deletingSalon.name);
        
        const success = await handleDelete(deletingSalon.id);
        
        if (success) {
          safeSetState(setDeletingSalon, null);
          
          if (selectedSalon?.id === deletingSalon.id) {
            safeSetState(setSelectedSalon, null);
          }
          
          toast.success(`Salongen "${deletingSalon.name}" har tagits bort`);
        }
      } catch (error) {
        console.error("[useSalonsList] Error deleting salon:", error);
        toast.error("Ett fel uppstod vid borttagning av salongen");
      } finally {
        actionInProgressRef.current = false;
      }
    }
  };

  /**
   * Handle salon update with action tracking
   */
  const onUpdate = async (values: any) => {
    if (editingSalon && !actionInProgressRef.current) {
      try {
        actionInProgressRef.current = true;
        console.log("[useSalonsList] Updating salon:", editingSalon.name, "with values:", values);
        
        const success = await handleUpdate(values, editingSalon.id);
        
        if (success && isMountedRef.current) {
          safeSetState(setEditingSalon, null);
          
          // Update selected salon if it's the one being edited
          if (selectedSalon?.id === editingSalon.id) {
            // Find updated salon in the list
            await fetchSalons();
          }
        }
      } catch (error) {
        console.error("[useSalonsList] Error updating salon:", error);
      } finally {
        actionInProgressRef.current = false;
      }
    }
  };

  /**
   * Handle salon creation with action tracking
   */
  const onCreate = async (values: any) => {
    if (!actionInProgressRef.current) {
      try {
        actionInProgressRef.current = true;
        console.log("[useSalonsList] Creating new salon with values:", values);
        
        const response = await handleCreate(values);
        return response;
      } catch (error) {
        console.error("[useSalonsList] Error creating salon:", error);
        return false;
      } finally {
        actionInProgressRef.current = false;
      }
    }
    return false;
  };

  /**
   * Handle salon rating with action tracking
   */
  const onRate = async (salonId: number, rating: number, comment: string) => {
    try {
      if (actionInProgressRef.current) {
        console.log("[useSalonsList] Rating operation already in progress");
        return false;
      }
      
      actionInProgressRef.current = true;
      safeSetState(setIsRating, true);
      
      // Ensure rating is properly formatted (up to 1 decimal place)
      const formattedRating = Math.round(rating * 10) / 10;
      
      console.log("[useSalonsList] Rating salon:", salonId, "rating:", formattedRating, "comment:", comment);
      
      // Update the salon's rating
      const { error: updateError } = await supabase
        .from('salons')
        .update({ 
          rating: formattedRating,
          rating_comment: comment
        })
        .eq('id', salonId);
      
      if (updateError) {
        console.error("[useSalonsList] Error updating salon rating:", updateError);
        toast.error("Kunde inte spara betyg");
        return false;
      }
      
      // Add to rating history
      try {
        const { error: ratingError } = await supabase
          .from('salon_ratings')
          .insert({
            salon_id: salonId,
            rating: formattedRating,
            comment: comment,
            created_by: 'admin'
          });
          
        if (ratingError) {
          console.warn("[useSalonsList] Could not save rating history:", ratingError);
        }
      } catch (historyError) {
        console.warn("[useSalonsList] Couldn't save rating history:", historyError);
      }
      
      // Update local salon data
      console.log("[useSalonsList] Rating saved, fetching updated salon data...");
      await fetchSalons();
      
      if (isMountedRef.current) {
        safeSetState(setRatingSalon, null);
      }
      return true;
    } catch (error) {
      console.error("[useSalonsList] Error in rating salon:", error);
      toast.error("Ett fel uppstod när betyget skulle sparas");
      return false;
    } finally {
      actionInProgressRef.current = false;
      if (isMountedRef.current) {
        safeSetState(setIsRating, false);
      }
    }
  };

  /**
   * Parse address field for editing
   */
  const getInitialValuesForEdit = (salon: Salon): SalonFormValues => {
    const initialValues: SalonFormValues = {
      name: salon.name,
      email: salon.email,
      phone: salon.phone || "",
      address: salon.address || "",
      termsAccepted: salon.terms_accepted !== false,
      privacyAccepted: salon.privacy_accepted !== false,
    };

    console.log("[useSalonsList] Preparing initial values for salon:", salon.name, "address:", salon.address);
    
    return initialValues;
  };

  return {
    salons,
    isLoading,
    error,
    editingSalon,
    deletingSalon,
    selectedSalon,
    isCreating,
    ratingSalon,
    isRating,
    setEditingSalon: (salon: Salon | null) => safeSetState(setEditingSalon, salon),
    setDeletingSalon: (salon: Salon | null) => safeSetState(setDeletingSalon, salon),
    setSelectedSalon: (salon: Salon | null) => safeSetState(setSelectedSalon, salon),
    setIsCreating: (value: boolean) => safeSetState(setIsCreating, value),
    setRatingSalon: (salon: Salon | null) => safeSetState(setRatingSalon, salon),
    onDelete,
    onUpdate,
    onCreate,
    onRate,
    getInitialValuesForEdit
  };
};
