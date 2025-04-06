
import { useSalonsAdmin } from "@/hooks/useSalonsAdmin";
import { useSalonState } from "@/hooks/salon/useSalonState";
import { useSalonOperationsWithTracking } from "@/hooks/salon/useSalonOperations";
import { useSalonRating } from "@/hooks/salon/useSalonRating";
import { getInitialValuesForEdit } from "@/hooks/salon/salonFormUtils";
import { useEffect } from "react";

/**
 * Hook for managing salon list state and operations
 */
export const useSalonsList = () => {
  // Get salon state management functionality
  const {
    editingSalon, 
    deletingSalon, 
    selectedSalon,
    isCreating,
    ratingSalon,
    isRating,
    setEditingSalon,
    setDeletingSalon,
    setSelectedSalon,
    setIsCreating,
    setRatingSalon,
    setIsRating,
    isMountedRef
  } = useSalonState();
  
  // Get salon data and CRUD operations from admin hook
  const { 
    salons, 
    isLoading, 
    error, 
    handleDelete, 
    handleUpdate, 
    handleCreate, 
    fetchSalons 
  } = useSalonsAdmin();

  // Fetch salons when component mounts
  useEffect(() => {
    console.log("[useSalonsList] Fetching salons data...");
    fetchSalons();
  }, [fetchSalons]);

  // Get enhanced CRUD operations with action tracking
  const { onDelete, onUpdate, onCreate } = useSalonOperationsWithTracking(
    handleDelete,
    handleUpdate,
    handleCreate,
    fetchSalons,
    isMountedRef
  );

  // Get rating functionality
  const { onRate } = useSalonRating(
    fetchSalons,
    isMountedRef,
    setIsRating,
    setRatingSalon
  );

  // Enhanced delete operation that uses state from this hook
  const handleDeleteSalon = async () => {
    await onDelete(deletingSalon, selectedSalon, setSelectedSalon, setDeletingSalon);
  };

  // Enhanced update operation that uses state from this hook
  const handleUpdateSalon = async (values: any) => {
    await onUpdate(values, editingSalon, setEditingSalon);
  };

  // Return all functionality combined
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
    setEditingSalon,
    setDeletingSalon,
    setSelectedSalon,
    setIsCreating,
    setRatingSalon,
    onDelete: handleDeleteSalon,
    onUpdate: handleUpdateSalon,
    onCreate,
    onRate,
    getInitialValuesForEdit
  };
};
