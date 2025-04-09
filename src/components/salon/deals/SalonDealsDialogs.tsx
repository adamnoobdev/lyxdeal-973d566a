
import React, { useEffect, useRef } from 'react';
import { DealDialog } from '@/components/salon/DealDialog';
import { DeleteDealDialog } from '@/components/admin/deals/DeleteDealDialog';
import { DiscountCodesDialog } from '@/components/admin/deals/DiscountCodesDialog';
import { Deal } from '@/components/admin/types';
import { FormValues } from '@/components/deal-form/schema';

interface SalonDealsDialogsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingDeal: Deal | null;
  setEditingDeal: (deal: Deal | null) => void;
  deleteData: {
    deletingDeal: Deal | null;
    setDeletingDeal: (deal: Deal | null) => void;
    handleDelete: () => Promise<void>;
  };
  codeData: {
    viewingCodesForDeal: Deal | null;
    setViewingCodesForDeal: (deal: Deal | null) => void;
    isClosingCodesDialog: boolean;
    setIsClosingCodesDialog: (isClosing: boolean) => void;
  };
  onUpdate: (values: FormValues) => Promise<boolean | void>;
  onCreate: (values: FormValues) => Promise<boolean | void>;
}

export const SalonDealsDialogs: React.FC<SalonDealsDialogsProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  editingDeal,
  setEditingDeal,
  deleteData,
  codeData,
  onUpdate,
  onCreate
}) => {
  // Use separate closing state flags to prevent UI freezing
  const [isMainDialogClosing, setIsMainDialogClosing] = React.useState(false);
  const [isDeleteDialogClosing, setIsDeleteDialogClosing] = React.useState(false);
  
  // Track component mount status
  const isMountedRef = useRef(true);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  // Track dialog states for debugging
  useEffect(() => {
    console.log("[SalonDealsDialogs] Rendering with states:", {
      editDialogOpen: isDialogOpen,
      deleteDialogOpen: !!deleteData.deletingDeal,
      codesDialogOpen: !!codeData.viewingCodesForDeal,
      mainClosing: isMainDialogClosing,
      deleteClosing: isDeleteDialogClosing,
      codesClosing: codeData.isClosingCodesDialog
    });
    
    // Set mounted state ref
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear all pending timeouts on unmount
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, [
    isDialogOpen, 
    deleteData.deletingDeal, 
    codeData.viewingCodesForDeal, 
    isMainDialogClosing,
    isDeleteDialogClosing,
    codeData.isClosingCodesDialog
  ]);
  
  // Helper to safely set timeout
  const safeTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  };
  
  // Safe closing function for main dialog with state management
  const handleDialogClose = () => {
    if (isMainDialogClosing) {
      console.log("[SalonDealsDialogs] Main dialog already closing, skipping");
      return;
    }
    
    console.log("[SalonDealsDialogs] Closing main dialog");
    setIsMainDialogClosing(true);
    
    // Use setTimeout to safely update state
    safeTimeout(() => {
      setIsDialogOpen(false);
      
      // Use a small delay before resetting edit state
      safeTimeout(() => {
        setEditingDeal(null);
        setIsMainDialogClosing(false);
      }, 300);
    }, 100);
  };

  // Safe closing function for delete dialog with state management
  const handleCloseDeleteDialog = () => {
    if (isDeleteDialogClosing) {
      console.log("[SalonDealsDialogs] Delete dialog already closing, skipping");
      return;
    }
    
    console.log("[SalonDealsDialogs] Closing delete dialog");
    setIsDeleteDialogClosing(true);
    
    // Use setTimeout to safely update state
    safeTimeout(() => {
      deleteData.setDeletingDeal(null);
      
      safeTimeout(() => {
        setIsDeleteDialogClosing(false);
      }, 300);
    }, 100);
  };

  // Safe closing function for codes dialog
  const handleCloseCodeDialog = () => {
    if (codeData.isClosingCodesDialog) {
      console.log("[SalonDealsDialogs] Codes dialog already closing, skipping");
      return;
    }
    
    console.log("[SalonDealsDialogs] Closing codes dialog");
    // Update closing state first to prevent multiple close attempts
    codeData.setIsClosingCodesDialog(true);
    
    // Use setTimeout to safely update state
    safeTimeout(() => {
      codeData.setViewingCodesForDeal(null);
      
      safeTimeout(() => {
        codeData.setIsClosingCodesDialog(false);
      }, 300);
    }, 100);
  };

  // Add unique keys to all dialog components to ensure clean unmounting
  return (
    <>
      {/* Create/Edit Deal Dialog */}
      <DealDialog
        key={`edit-deal-${editingDeal?.id || 'new'}-${isDialogOpen}`}
        isOpen={isDialogOpen && !isMainDialogClosing}
        onClose={handleDialogClose}
        onSubmit={editingDeal ? onUpdate : onCreate}
        initialValues={
          editingDeal ? {
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
            quantity: editingDeal.quantity_left?.toString() || "10",
            booking_url: editingDeal.booking_url || "",
            requires_discount_code: editingDeal.requires_discount_code !== false,
            expirationDate: editingDeal.expiration_date ? new Date(editingDeal.expiration_date) : new Date(),
            is_active: editingDeal.is_active
          } : undefined
        }
      />

      {/* Delete Deal Dialog */}
      <DeleteDealDialog
        key={`delete-deal-${deleteData.deletingDeal?.id || 'none'}-${!!deleteData.deletingDeal}-${isDeleteDialogClosing}`}
        isOpen={!!deleteData.deletingDeal && !isDeleteDialogClosing}
        onClose={handleCloseDeleteDialog}
        onConfirm={deleteData.handleDelete}
        dealTitle={deleteData.deletingDeal?.title || ''}
      />

      {/* Discount Codes Dialog */}
      <DiscountCodesDialog
        key={`codes-${codeData.viewingCodesForDeal?.id || 'none'}-${!!codeData.viewingCodesForDeal}-${codeData.isClosingCodesDialog}`}
        isOpen={!!codeData.viewingCodesForDeal && !codeData.isClosingCodesDialog}
        onClose={handleCloseCodeDialog}
        deal={codeData.viewingCodesForDeal}
      />
    </>
  );
};
