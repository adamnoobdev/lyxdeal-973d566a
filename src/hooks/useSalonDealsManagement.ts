
import { useState, useEffect, useRef, useCallback } from "react";
import { Deal } from "@/components/admin/types";
import { UseSalonDealsReturn } from "./deals/dealTypes";
import { deleteDeal, updateDeal, toggleActive } from "./deals/dealOperations";
import { loadSalonDeals } from "./deals/loadSalonDeals";
import { FormValues } from "@/components/deal-form/schema";

export const useSalonDealsManagement = (salonId: string | undefined): UseSalonDealsReturn => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  
  // Refs for tracking async operations and component lifecycle
  const isLoadingDeals = useRef(false);
  const isUpdatingDeal = useRef(false);
  const isDeletingDeal = useRef(false);
  const isMountedRef = useRef(true);
  const previousSalonId = useRef<string | undefined>(undefined);
  const loadAttempts = useRef(0);

  // Wrapper function to load salon deals
  const fetchSalonDeals = useCallback(async () => {
    await loadSalonDeals(
      salonId,
      setDeals,
      setError,
      setIsLoading,
      isLoadingDeals,
      isMountedRef,
      loadAttempts
    );
  }, [salonId]);

  // Explicit refetch function to expose to consumers
  const refetch = useCallback(async () => {
    console.log("[useSalonDealsManagement] Refetching deals");
    // Reset attempt counter to ensure we can refetch even after previous failures
    loadAttempts.current = 0;
    await fetchSalonDeals();
  }, [fetchSalonDeals]);

  // Handler for deleting a deal
  const handleDeleteDeal = useCallback(async (): Promise<boolean> => {
    const result = await deleteDeal(
      deletingDeal,
      setDeals,
      setDeletingDeal,
      isDeletingDeal,
      isMountedRef
    );
    
    // Make sure to refetch data after deletion to ensure UI is updated
    if (result) {
      setTimeout(() => {
        refetch();
      }, 300);
    }
    
    return result;
  }, [deletingDeal, refetch]);

  // Handler for updating a deal - now returns Promise<boolean | void>
  const handleUpdate = useCallback(async (values: FormValues): Promise<boolean | void> => {
    try {
      return await updateDeal(
        editingDeal,
        values,
        setDeals,
        setEditingDeal,
        isUpdatingDeal,
        isMountedRef
      );
    } catch (error) {
      console.error("[useSalonDealsManagement] Error updating deal:", error);
      return false;
    }
  }, [editingDeal]);

  // Handler for creating a new deal - returns Promise<boolean | void>
  const handleCreate = useCallback(async (values: FormValues): Promise<boolean | void> => {
    try {
      // Implementation of deal creation logic would be here
      console.log("[useSalonDealsManagement] Creating new deal with values:", values);
      // This would typically call an API function or Supabase method
      
      // Then refetch deals
      await refetch();
      return true;
    } catch (error) {
      console.error("[useSalonDealsManagement] Error creating deal:", error);
      return false;
    }
  }, [refetch]);

  // Handler for toggling deal active status
  const handleToggleActive = useCallback(async (deal: Deal) => {
    await toggleActive(deal, setDeals, isMountedRef);
  }, []);

  // Effect for component lifecycle and data loading
  useEffect(() => {
    isMountedRef.current = true;
    
    // Only load deals if salonId has changed
    if (salonId && previousSalonId.current !== salonId) {
      console.log(`[useSalonDealsManagement] SalonId changed from ${previousSalonId.current} to ${salonId}, reloading deals`);
      previousSalonId.current = salonId;
      fetchSalonDeals();
    }
    
    return () => {
      console.log("[useSalonDealsManagement] unmounting");
      isMountedRef.current = false;
    };
  }, [salonId, fetchSalonDeals]);

  // Filter deals by active/inactive status
  const activeDeals = deals.filter(deal => deal.is_active);
  const inactiveDeals = deals.filter(deal => !deal.is_active);
  
  return {
    deals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error,
    editingDeal,
    deletingDeal,
    setEditingDeal,
    setDeletingDeal,
    handleDelete: handleDeleteDeal,
    handleUpdate,
    handleCreate,
    handleToggleActive,
    refetch,
  };
};
