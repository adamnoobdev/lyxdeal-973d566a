
import { useState, useEffect, useRef, useCallback } from "react";
import { Deal } from "@/components/admin/types";
import { UseSalonDealsReturn } from "./deals/dealTypes";
import { deleteDeal, updateDeal, toggleActive } from "./deals/dealOperations";
import { loadSalonDeals } from "./deals/loadSalonDeals";

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

  // Handler for updating a deal
  const handleUpdate = useCallback(async (values: any) => {
    await updateDeal(
      editingDeal,
      values,
      setDeals,
      setEditingDeal,
      isUpdatingDeal,
      isMountedRef
    );
  }, [editingDeal]);

  // Handler for toggling deal active status
  const handleToggleActive = useCallback(async (deal: Deal) => {
    await toggleActive(deal, setDeals, isMountedRef);
  }, []);

  // Effect for component lifecycle and data loading
  useEffect(() => {
    isMountedRef.current = true;
    
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
    handleToggleActive,
  };
};
