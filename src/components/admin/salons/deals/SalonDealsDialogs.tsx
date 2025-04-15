
import React, { useEffect, useRef } from 'react';
import { EditDealDialog } from "../../deals/EditDealDialog";
import { DeleteDealDialog } from "../../deals/DeleteDealDialog";
import { DiscountCodesDialog } from "../../deals/DiscountCodesDialog";
import { Deal } from "@/types/deal"; // Use the correct Deal type

interface SalonDealsDialogsProps {
  editingDeal: Deal | null;
  deletingDeal: Deal | null;
  initialValues: any;
  isSubmitting: boolean;
  isDiscountCodesDialogOpen: boolean;
  viewingCodesForDeal: Deal | null;
  handleClose: () => void;
  handleCloseDelete: () => void;
  handleCloseDiscountCodesDialog: () => void;
  handleUpdateSubmit: (values: any) => Promise<void>;
  handleDeleteDeal: () => Promise<void>;
}

export const SalonDealsDialogs: React.FC<SalonDealsDialogsProps> = ({
  editingDeal,
  deletingDeal,
  initialValues,
  isSubmitting,
  isDiscountCodesDialogOpen,
  viewingCodesForDeal,
  handleClose,
  handleCloseDelete,
  handleCloseDiscountCodesDialog,
  handleUpdateSubmit,
  handleDeleteDeal
}) => {
  // Add logging to help diagnose issues
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    console.log("[SalonDealsDialogs] Rendering with dialogs:", { 
      isEditingOpen: !!editingDeal,
      isDeletingOpen: !!deletingDeal,
      isDiscountDialogOpen: isDiscountCodesDialogOpen
    });
    
    return () => {
      console.log("[SalonDealsDialogs] Component unmounting");
      isMountedRef.current = false;
    };
  }, [editingDeal, deletingDeal, isDiscountCodesDialogOpen]);

  // Safe wrapper for callbacks to prevent state updates after unmounting
  const safeHandleUpdateSubmit = async (values: any) => {
    if (isMountedRef.current) {
      await handleUpdateSubmit(values);
    }
  };
  
  const safeHandleDeleteDeal = async () => {
    if (isMountedRef.current) {
      await handleDeleteDeal();
    }
  };

  return (
    <>
      <EditDealDialog
        key={`edit-${editingDeal?.id || 'new'}`}
        isOpen={!!editingDeal}
        onClose={handleClose}
        onSubmit={safeHandleUpdateSubmit}
        initialValues={initialValues}
      />

      <DeleteDealDialog
        key={`delete-${deletingDeal?.id || 'none'}`}
        isOpen={!!deletingDeal}
        onClose={handleCloseDelete}
        onConfirm={safeHandleDeleteDeal}
        dealTitle={deletingDeal?.title}
      />

      <DiscountCodesDialog
        key={`codes-${viewingCodesForDeal?.id || 'none'}`}
        isOpen={isDiscountCodesDialogOpen}
        onClose={handleCloseDiscountCodesDialog}
        deal={viewingCodesForDeal}
      />
    </>
  );
};
