
import React, { useEffect, useRef } from 'react';
import { DealDialog } from '@/components/salon/DealDialog';
import { DeleteDealDialog } from '@/components/admin/deals/DeleteDealDialog';
import { DiscountCodesDialog } from '@/components/admin/deals/DiscountCodesDialog';
import { Deal } from '@/types/deal'; // Use the correct Deal type
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
  // Use refs to track component lifecycle and dialog states
  const isMountedRef = useRef(true);
  const timeoutsRef = useRef<number[]>([]);
  
  // Track dialog state
  const [isMainDialogClosing, setIsMainDialogClosing] = React.useState(false);
  const [isDeleteDialogClosing, setIsDeleteDialogClosing] = React.useState(false);
  
  // Track component mount status and clean up timeouts
  useEffect(() => {
    isMountedRef.current = true;
    
    // Log dialog states for debugging
    console.log("[SalonDealsDialogs] Rendering with states:", {
      editDialogOpen: isDialogOpen,
      deleteDialogOpen: !!deleteData.deletingDeal,
      codesDialogOpen: !!codeData.viewingCodesForDeal,
      mainClosing: isMainDialogClosing,
      deleteClosing: isDeleteDialogClosing,
      codesClosing: codeData.isClosingCodesDialog
    });
    
    return () => {
      isMountedRef.current = false;
      // Clear all timeouts on unmount
      timeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
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
    const id = window.setTimeout(() => {
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.push(id);
    return id;
  };
  
  // Safe closing function for main dialog
  const handleDialogClose = () => {
    if (isMainDialogClosing) {
      console.log("[SalonDealsDialogs] Main dialog already closing, skipping");
      return;
    }
    
    console.log("[SalonDealsDialogs] Closing main dialog");
    setIsMainDialogClosing(true);
    
    safeTimeout(() => {
      setIsDialogOpen(false);
      
      safeTimeout(() => {
        if (isMountedRef.current) {
          setEditingDeal(null);
          setIsMainDialogClosing(false);
        }
      }, 300);
    }, 50);
  };

  // Safe closing function for delete dialog
  const handleCloseDeleteDialog = () => {
    if (isDeleteDialogClosing) {
      console.log("[SalonDealsDialogs] Delete dialog already closing, skipping");
      return;
    }
    
    console.log("[SalonDealsDialogs] Closing delete dialog");
    setIsDeleteDialogClosing(true);
    
    safeTimeout(() => {
      deleteData.setDeletingDeal(null);
      
      safeTimeout(() => {
        if (isMountedRef.current) {
          setIsDeleteDialogClosing(false);
        }
      }, 300);
    }, 50);
  };

  // Safe closing function for codes dialog
  const handleCloseCodeDialog = () => {
    if (codeData.isClosingCodesDialog) {
      console.log("[SalonDealsDialogs] Codes dialog already closing, skipping");
      return;
    }
    
    console.log("[SalonDealsDialogs] Closing codes dialog");
    codeData.setIsClosingCodesDialog(true);
    
    safeTimeout(() => {
      codeData.setViewingCodesForDeal(null);
      
      safeTimeout(() => {
        if (isMountedRef.current) {
          codeData.setIsClosingCodesDialog(false);
        }
      }, 300);
    }, 50);
  };

  // Add unique keys to all dialog components to ensure clean unmounting
  return (
    <>
      {/* Create/Edit Deal Dialog */}
      <DealDialog
        key={`edit-deal-${editingDeal?.id || 'new'}-${isDialogOpen}-${Date.now()}`}
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
        key={`delete-deal-${deleteData.deletingDeal?.id || 'none'}-${!!deleteData.deletingDeal}-${Date.now()}`}
        isOpen={!!deleteData.deletingDeal && !isDeleteDialogClosing}
        onClose={handleCloseDeleteDialog}
        onConfirm={deleteData.handleDelete}
        dealTitle={deleteData.deletingDeal?.title || ''}
      />

      {/* Discount Codes Dialog */}
      <DiscountCodesDialog
        key={`codes-${codeData.viewingCodesForDeal?.id || 'none'}-${!!codeData.viewingCodesForDeal}-${Date.now()}`}
        isOpen={!!codeData.viewingCodesForDeal && !codeData.isClosingCodesDialog}
        onClose={handleCloseCodeDialog}
        deal={codeData.viewingCodesForDeal}
      />
    </>
  );
};
