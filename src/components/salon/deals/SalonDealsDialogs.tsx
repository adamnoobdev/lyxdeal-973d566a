
import React, { useEffect, useRef } from 'react';
import { DealDialog } from '@/components/salon/DealDialog';
import { DeleteDealDialog } from '@/components/admin/deals/DeleteDealDialog';
import { DiscountCodesDialog } from '@/components/admin/deals/DiscountCodesDialog';
import { Deal } from '@/components/admin/types';
import { FormValues } from '@/components/deal-form/schema';
import { endOfMonth } from 'date-fns';
import { Sheet, SheetContent } from '@/components/ui/sheet';

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
  // Använd refs för att undvika problem med samtidiga operationer
  const isClosingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timers vid unmount för att undvika memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
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

  // Förbättrad stängningsfunktion för koddialoger
  const handleCloseCodeDialog = () => {
    // Anropa direkt för att uppdatera föräldrastate
    codeData.setViewingCodesForDeal(null);
    
    // Använd setTimeout för att fördröja visuell stängning
    setTimeout(() => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;
      codeData.setIsClosingCodesDialog(true);
      
      timeoutRef.current = setTimeout(() => {
        codeData.setIsClosingCodesDialog(false);
        isClosingRef.current = false;
      }, 200);
    }, 10);
  };

  // Förbättrad stängningsfunktion för huvuddialoger
  const handleDialogClose = () => {
    // Anropa direkt för att uppdatera föräldrastate
    setIsDialogOpen(false);
    
    // Använd setTimeout för att fördröja återställning av editingDeal
    setTimeout(() => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;
      
      console.log("Cleaning up dialog state");
      setEditingDeal(null);
      isClosingRef.current = false;
    }, 50);
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
        onClose={() => deleteData.setDeletingDeal(null)}
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
