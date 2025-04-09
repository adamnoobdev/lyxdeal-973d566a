
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
  // Use separate closing state flags to prevent UI freezing
  const [isMainDialogClosing, setIsMainDialogClosing] = React.useState(false);
  const [isDeleteDialogClosing, setIsDeleteDialogClosing] = React.useState(false);
  
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

  // Safe closing function for main dialog with state management
  const handleDialogClose = () => {
    if (isMainDialogClosing) return;
    
    setIsMainDialogClosing(true);
    
    // Use setTimeout to safely update state
    setTimeout(() => {
      setIsDialogOpen(false);
      
      // Use a small delay before resetting edit state
      setTimeout(() => {
        setEditingDeal(null);
        setIsMainDialogClosing(false);
      }, 50);
    }, 10);
  };

  // Safe closing function for delete dialog with state management
  const handleCloseDeleteDialog = () => {
    if (isDeleteDialogClosing) return;
    
    setIsDeleteDialogClosing(true);
    
    // Use setTimeout to safely update state
    setTimeout(() => {
      deleteData.setDeletingDeal(null);
      
      setTimeout(() => {
        setIsDeleteDialogClosing(false);
      }, 50);
    }, 10);
  };

  // Safe closing function for codes dialog
  const handleCloseCodeDialog = () => {
    if (codeData.isClosingCodesDialog) return;
    
    // Update closing state first to prevent multiple close attempts
    codeData.setIsClosingCodesDialog(true);
    
    // Use setTimeout to safely update state
    setTimeout(() => {
      codeData.setViewingCodesForDeal(null);
      
      setTimeout(() => {
        codeData.setIsClosingCodesDialog(false);
      }, 50);
    }, 10);
  };

  return (
    <>
      {/* Create/Edit Deal Dialog */}
      <DealDialog
        isOpen={isDialogOpen && !isMainDialogClosing}
        onClose={handleDialogClose}
        onSubmit={editingDeal ? onUpdate : onCreate}
        initialValues={initialValues}
        isEditing={!!editingDeal}
      />

      {/* Delete Deal Dialog */}
      <DeleteDealDialog
        isOpen={!!deleteData.deletingDeal && !isDeleteDialogClosing}
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
