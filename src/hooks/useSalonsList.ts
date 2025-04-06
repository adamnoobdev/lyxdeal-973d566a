
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
  
  const { salons, isLoading, error, handleDelete, handleUpdate, handleCreate, fetchSalons } = useSalonsAdmin();

  // Ensure component is mounted
  useEffect(() => {
    isMountedRef.current = true;
    return () => { 
      isMountedRef.current = false; 
    };
  }, []);

  // Fetch salons when component mounts
  useEffect(() => {
    console.log("SalonsList mounting, fetching salons data...");
    fetchSalons();
  }, [fetchSalons]);

  // Safe state setter for component unmount protection
  const safeSetState = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  /**
   * Handle salon deletion
   */
  const onDelete = async () => {
    if (deletingSalon) {
      const success = await handleDelete(deletingSalon.id);
      if (success) {
        safeSetState(setDeletingSalon, null);
        if (selectedSalon?.id === deletingSalon.id) {
          safeSetState(setSelectedSalon, null);
        }
      }
    }
  };

  /**
   * Handle salon update
   */
  const onUpdate = async (values: any) => {
    if (editingSalon) {
      console.log("Updating salon with values:", values);
      const success = await handleUpdate(values, editingSalon.id);
      if (success && isMountedRef.current) {
        safeSetState(setEditingSalon, null);
      }
    }
  };

  /**
   * Handle salon creation
   */
  const onCreate = async (values: any) => {
    const response = await handleCreate(values);
    return response;
  };

  /**
   * Handle salon rating
   */
  const onRate = async (salonId: number, rating: number, comment: string) => {
    try {
      safeSetState(setIsRating, true);
      console.log("Betygsätter salong:", salonId, "betyg:", rating, "kommentar:", comment);
      
      // Update the salon's rating
      const { error: updateError } = await supabase
        .from('salons')
        .update({ 
          rating: rating,
          rating_comment: comment
        })
        .eq('id', salonId);
      
      if (updateError) {
        console.error("Error updating salon rating:", updateError);
        toast.error("Kunde inte spara betyg");
        return false;
      }
      
      // Add to rating history
      try {
        const { error: ratingError } = await supabase
          .from('salon_ratings')
          .insert({
            salon_id: salonId,
            rating: rating,
            comment: comment,
            created_by: 'admin'
          });
          
        if (ratingError) {
          console.warn("Could not save rating history:", ratingError);
        }
      } catch (historyError) {
        console.warn("Couldn't save rating history:", historyError);
      }
      
      // Update local salon data
      console.log("Rating saved, fetching updated salon data...");
      await fetchSalons();
      
      if (isMountedRef.current) {
        safeSetState(setRatingSalon, null);
      }
      return true;
    } catch (error) {
      console.error("Error in rating salon:", error);
      toast.error("Ett fel uppstod när betyget skulle sparas");
      return false;
    } finally {
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

    console.log("Preparing initial values for salon:", salon.name, "address:", salon.address);
    
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
