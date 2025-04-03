
import { useCallback, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import { endOfMonth } from "date-fns";
import { useSalonDealsManagement } from "@/hooks/salon-deals-management";
import { Deal } from "@/components/admin/types";

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
    handleToggleActive,
  } = useSalonDealsManagement(salonId);

  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = useCallback((deal: Deal) => {
    setEditingDeal(deal);
  }, [setEditingDeal]);

  const handleDeleteClick = useCallback((deal: Deal) => {
    setDeletingDeal(deal);
  }, [setDeletingDeal]);

  const handleClose = useCallback(() => {
    setEditingDeal(null);
  }, [setEditingDeal]);

  const handleCloseDelete = useCallback(() => {
    setDeletingDeal(null);
  }, [setDeletingDeal]);

  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    setViewingCodesForDeal(deal);
  }, []);

  const handleCloseDiscountCodesDialog = useCallback(() => {
    console.log("[AdminSalonDeals] Closing discount codes dialog");
    setIsClosingCodesDialog(true);
    
    // Use setTimeout to delay state updates and prevent UI freeze
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
    }, 300);
  }, []);
  
  const handleUpdateSubmit = useCallback(async (values: any) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await handleUpdate(values);
    } finally {
      setIsSubmitting(false);
      // Use setTimeout to delay state update to next event loop
      setTimeout(() => {
        handleClose();
      }, 0);
    }
  }, [handleUpdate, handleClose, isSubmitting]);
  
  // Use useMemo for initialValues to prevent unnecessary calculations on re-renders
  const initialValues = useMemo(() => {
    if (!editingDeal) return undefined;
    
    return {
      title: editingDeal.title,
      description: editingDeal.description,
      imageUrl: editingDeal.image_url,
      originalPrice: editingDeal.original_price.toString(),
      // Set discounted price to "0" for free deals regardless of actual stored value
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

  // Calculate whether the dialog should be open based on viewing deal and closing state
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
