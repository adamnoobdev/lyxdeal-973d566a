
import { useState, useEffect, useRef, useCallback } from "react";
import { Deal } from "@/types/deal"; // Changed from admin/types to types/deal
import { UseSalonDealsReturn } from "./salon-deals-management/types";
import { deleteDeal, updateDeal, toggleActive } from "./deals/dealOperations";
import { loadSalonDeals } from "./salon-deals-management/loadDeals";
import { FormValues } from "@/components/deal-form/schema";
import { toast } from "sonner";
import { createDeal as createDealApi } from "./salon-deals/createDeal";

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

  // For debugging
  useEffect(() => {
    console.log("[useSalonDealsManagement] Initialized with salonId:", salonId);
  }, [salonId]);

  // Wrapper function to load salon deals
  const fetchSalonDeals = useCallback(async () => {
    if (!salonId) {
      console.log("[useSalonDealsManagement] No salon ID provided, skipping fetch");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("[useSalonDealsManagement] Fetching deals for salon ID:", salonId);
      await loadSalonDeals(
        salonId,
        setDeals,
        setError,
        setIsLoading,
        isLoadingDeals,
        isMountedRef,
        loadAttempts
      );
    } catch (error) {
      console.error("[useSalonDealsManagement] Error in fetchSalonDeals:", error);
      if (isMountedRef.current) {
        setError("Ett fel uppstod när erbjudanden skulle hämtas.");
        setIsLoading(false);
      }
    }
  }, [salonId]);

  // Explicit refetch function to expose to consumers
  const refetch = useCallback(async () => {
    console.log("[useSalonDealsManagement] Refetching deals for salon ID:", salonId);
    // Reset attempt counter to ensure we can refetch even after previous failures
    loadAttempts.current = 0;
    await fetchSalonDeals();
  }, [fetchSalonDeals, salonId]);

  // Handler for deleting a deal
  const handleDelete = useCallback(async () => {
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
    if (isCreatingDeal.current) {
      console.log("[useSalonDealsManagement] Creation already in progress, skipping");
      return false;
    }
    
    try {
      console.log("[useSalonDealsManagement] Creating deal with salonId:", salonId);
      console.log("[useSalonDealsManagement] Form values:", values);
      
      if (!salonId && !values.salon_id) {
        console.error("[useSalonDealsManagement] No salon ID provided");
        toast.error("Kunde inte identifiera salongen.");
        return false;
      }
      
      isCreatingDeal.current = true;
      
      // Set salon_id if needed
      if (salonId && !values.salon_id) {
        values.salon_id = parseInt(salonId, 10);
      }
      
      // Ensure required fields are set
      if (!values.category) {
        console.error("[useSalonDealsManagement] Missing category");
        toast.error("Kategori är obligatoriskt");
        isCreatingDeal.current = false;
        return false;
      }
      
      if (!values.city) {
        console.error("[useSalonDealsManagement] Missing city");
        toast.error("Stad är obligatoriskt");
        isCreatingDeal.current = false;
        return false;
      }
      
      // Call the createDeal API function with only the values parameter
      const success = await createDealApi(values);
      
      if (success && isMountedRef.current) {
        console.log("[useSalonDealsManagement] Deal created successfully, refreshing deals");
        await refetch();
      }
      
      return success;
    } catch (error) {
      console.error("[useSalonDealsManagement] Error creating deal:", error);
      return false;
    } finally {
      isCreatingDeal.current = false;
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
    
    // Load deals when component mounts or salonId changes
    if (salonId && previousSalonId.current !== salonId) {
      console.log(`[useSalonDealsManagement] SalonId changed from ${previousSalonId.current} to ${salonId}, reloading deals`);
      previousSalonId.current = salonId;
      fetchSalonDeals();
    }
    
    return () => {
      console.log("[useSalonDealsManagement] Unmounting");
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
    handleDelete,
    handleUpdate,
    handleCreate,
    handleToggleActive,
    refetch,
  };
};
