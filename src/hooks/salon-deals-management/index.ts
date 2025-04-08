
import { useState, useEffect, useRef, useCallback } from "react";
import { Deal } from "@/components/admin/types";
import { UseSalonDealsReturn } from "./types";
import { deleteDeal, updateDeal, toggleActive, createDeal } from "./dealOperations";
import { loadSalonDeals } from "./loadDeals";
import { FormValues } from "@/components/deal-form/schema";

export const useSalonDealsManagement = (salonId: string | undefined): UseSalonDealsReturn => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  
  // Refs for tracking async operations and component lifecycle
  const isLoadingDeals = useRef<boolean>(false);
  const isUpdatingDeal = useRef<boolean>(false);
  const isDeletingDeal = useRef<boolean>(false);
  const isCreatingDeal = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const previousSalonId = useRef<string | undefined>(undefined);
  const loadAttempts = useRef<number>(0);

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
  const handleDeleteDeal = useCallback(async () => {
    await deleteDeal(
      deletingDeal,
      setDeals,
      setDeletingDeal,
      isDeletingDeal,
      isMountedRef
    );
  }, [deletingDeal]);

  // Handler for updating a deal - return type is Promise<boolean | void>
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

  // Handler for creating a new deal - return type is Promise<boolean | void>
  const handleCreate = useCallback(async (values: FormValues): Promise<boolean | void> => {
    try {
      console.log("[useSalonDealsManagement] Creating deal with salonId:", salonId);
      console.log("[useSalonDealsManagement] Form values:", values);
      
      if (!salonId) {
        console.error("[useSalonDealsManagement] No salon ID provided");
        return false;
      }
      
      // Ensure salon_id is set in values
      const formValues = {
        ...values,
        salon_id: values.salon_id || parseInt(salonId, 10)
      };
      
      console.log("[useSalonDealsManagement] Adjusted form values:", formValues);
      
      const success = await createDeal(
        formValues,
        salonId,
        setDeals,
        isCreatingDeal,
        isMountedRef
      );
      
      if (success) {
        await refetch();
      }
      
      return success;
    } catch (error) {
      console.error("[useSalonDealsManagement] Error creating deal:", error);
      return false;
    }
  }, [salonId, refetch]);

  // Handler for toggling deal active status
  const handleToggleActive = useCallback(async (deal: Deal) => {
    await toggleActive(deal, setDeals, isMountedRef);
  }, []);

  // Effect for component lifecycle and data loading
  useEffect(() => {
    isMountedRef.current = true;
    console.log("[useSalonDealsManagement] Mounting with salon ID:", salonId);
    
    // Only load deals if salonId has changed
    if (salonId && previousSalonId.current !== salonId) {
      console.log(`SalonId changed from ${previousSalonId.current} to ${salonId}, reloading deals`);
      previousSalonId.current = salonId;
      fetchSalonDeals();
    }
    
    return () => {
      console.log("useSalonDealsManagement unmounting");
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
