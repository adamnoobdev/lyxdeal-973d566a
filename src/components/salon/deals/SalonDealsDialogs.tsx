
import React, { useEffect, useRef } from 'react';
import { DealDialog } from '@/components/salon/DealDialog';
import { DeleteDealDialog } from '@/components/admin/deals/DeleteDealDialog';
import { DiscountCodesDialog } from '@/components/admin/deals/DiscountCodesDialog';
import { Deal } from '@/components/admin/types';
import { FormValues } from '@/components/deal-form/schema';
import { endOfMonth } from 'date-fns';

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
  // Use refs to track state and avoid race conditions
  const isDialogClosingRef = useRef(false);
  const isDeleteClosingRef = useRef(false);
  const isCodesClosingRef = useRef(false);
  
  // Format initial values for the form
  const initialValues = editingDeal ? {
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
    expirationDate: editingDeal.expiration_date ? new Date(editingDeal.expiration_date) : endOfMonth(new Date()),
    is_active: editingDeal.is_active
  } : undefined;

  // Safe closing function for main dialog
  const handleDialogClose = () => {
    if (isDialogClosingRef.current) return;
    
    // Call state updaters directly to avoid UI freeze
    setIsDialogOpen(false);
    
    // Use a small delay before resetting edit state
    isDialogClosingRef.current = true;
    setTimeout(() => {
      setEditingDeal(null);
      isDialogClosingRef.current = false;
    }, 50);
  };

  // Safe closing function for delete dialog
  const handleCloseDeleteDialog = () => {
    if (isDeleteClosingRef.current) return;
    
    // Call state updater directly
    deleteData.setDeletingDeal(null);
    
    // Mark as closing with a ref to avoid multiple clicks
    isDeleteClosingRef.current = true;
    setTimeout(() => {
      isDeleteClosingRef.current = false;
    }, 50);
  };

  // Safe closing function for codes dialog
  const handleCloseCodeDialog = () => {
    if (isCodesClosingRef.current) return;
    
    // Call state updaters in sequence with minimal delay
    codeData.setViewingCodesForDeal(null);
    codeData.setIsClosingCodesDialog(true);
    
    // Mark as closing with a ref to avoid multiple clicks
    isCodesClosingRef.current = true;
    setTimeout(() => {
      codeData.setIsClosingCodesDialog(false);
      isCodesClosingRef.current = false;
    }, 100);
  };

  return (
    <>
      {/* Create/Edit Deal Dialog */}
      <DealDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={editingDeal ? onUpdate : onCreate}
        initialValues={initialValues}
        isEditing={!!editingDeal}
      />

      {/* Delete Deal Dialog */}
      <DeleteDealDialog
        isOpen={!!deleteData.deletingDeal}
        onClose={handleCloseDeleteDialog}
        onConfirm={deleteData.handleDelete}
        dealTitle={deleteData.deletingDeal?.title || ''}
      />

      {/* Discount Codes Dialog */}
      <DiscountCodesDialog
        isOpen={!!codeData.viewingCodesForDeal && !codeData.isClosingCodesDialog}
        onClose={handleCloseCodeDialog}
        deal={codeData.viewingCodesForDeal}
      />
    </>
  );
};
