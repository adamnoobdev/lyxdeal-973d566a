
import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { endOfMonth } from "date-fns";
import { useSalonDealsManagement } from "@/hooks/salon-deals-management";
import { Deal } from "@/types/deal"; // Using the correct Deal type
import { toggleDealActive } from "@/utils/deal/queries/toggleActive";

export const useSalonDealsManager = () => {
  const { salonId } = useParams();
  const {
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
    refetch,
  } = useSalonDealsManagement(salonId);

  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeSetState = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      setTimeout(() => {
        if (isMountedRef.current) {
          setter(value);
        }
      }, 0);
    }
  }, []);

  const handleEdit = useCallback((deal: Deal) => {
    safeSetState(setEditingDeal, deal);
  }, [safeSetState, setEditingDeal]);

  const handleDeleteClick = useCallback((deal: Deal) => {
    safeSetState(setDeletingDeal, deal);
  }, [safeSetState, setDeletingDeal]);

  const handleClose = useCallback(() => {
    safeSetState(setEditingDeal, null);
  }, [safeSetState, setEditingDeal]);

  const handleCloseDelete = useCallback(() => {
    safeSetState(setDeletingDeal, null);
  }, [safeSetState, setDeletingDeal]);

  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    safeSetState(setViewingCodesForDeal, deal);
  }, [safeSetState]);

  const handleCloseDiscountCodesDialog = useCallback(() => {
    console.log("[useSalonDealsManager] Closing discount codes dialog");
    safeSetState(setIsClosingCodesDialog, true);
    
    setTimeout(() => {
      if (isMountedRef.current) {
        safeSetState(setViewingCodesForDeal, null);
        safeSetState(setIsClosingCodesDialog, false);
      }
    }, 300);
  }, [safeSetState]);
  
  const handleUpdateSubmit = useCallback(async (values: any) => {
    if (isSubmitting) return;
    
    try {
      safeSetState(setIsSubmitting, true);
      await handleUpdate(values);
    } finally {
      if (isMountedRef.current) {
        setTimeout(() => {
          safeSetState(setIsSubmitting, false);
          handleClose();
        }, 100);
      }
    }
  }, [handleUpdate, handleClose, isSubmitting, safeSetState]);
  
  const handleToggleActive = useCallback(async (deal: Deal): Promise<boolean> => {
    try {
      return await toggleDealActive(deal);
    } catch (error) {
      console.error("Error toggling deal active state:", error);
      return false;
    }
  }, []);

  const initialValues = useMemo(() => {
    if (!editingDeal) return undefined;
    
    return {
      title: editingDeal.title,
      description: editingDeal.description,
      imageUrl: editingDeal.image_url,
      originalPrice: editingDeal.original_price.toString(),
      discountedPrice: editingDeal.is_free ? "0" : editingDeal.discounted_price.toString(),
      category: editingDeal.category,
      city: editingDeal.city,
      featured: editingDeal.featured,
      salon_id: editingDeal.salon_id,
      is_free: editingDeal.is_free || false,
      is_active: editingDeal.is_active,
      quantity: editingDeal.quantity_left?.toString() || "10",
      expirationDate: editingDeal.expiration_date 
        ? new Date(editingDeal.expiration_date) 
        : endOfMonth(new Date()),
    };
  }, [editingDeal]);

  const isDiscountCodesDialogOpen = !!viewingCodesForDeal && !isClosingCodesDialog;

  return {
    deals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error,
    editingDeal,
    deletingDeal,
    viewingCodesForDeal,
    isClosingCodesDialog,
    isDiscountCodesDialogOpen,
    isSubmitting,
    initialValues,
    handleEdit,
    handleDeleteClick,
    handleClose,
    handleCloseDelete,
    handleViewDiscountCodes,
    handleCloseDiscountCodesDialog,
    handleUpdateSubmit,
    handleDeleteDeal,
    handleToggleActive
  };
};
