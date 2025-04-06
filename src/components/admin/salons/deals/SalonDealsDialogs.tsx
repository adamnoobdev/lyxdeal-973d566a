
import React, { useEffect } from 'react';
import { EditDealDialog } from "../../deals/EditDealDialog";
import { DeleteDealDialog } from "../../deals/DeleteDealDialog";
import { DiscountCodesDialog } from "../../deals/DiscountCodesDialog";
import { Deal } from "@/components/admin/types";

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
  useEffect(() => {
    console.log("[SalonDealsDialogs] Rendering with dialogs:", { 
      isEditingOpen: !!editingDeal,
      isDeletingOpen: !!deletingDeal,
      isDiscountDialogOpen: isDiscountCodesDialogOpen
    });
    
    return () => {
      console.log("[SalonDealsDialogs] Component unmounting");
    };
  }, [editingDeal, deletingDeal, isDiscountCodesDialogOpen]);

  return (
    <>
      <EditDealDialog
        key={`edit-${editingDeal?.id || 'new'}`}
        isOpen={!!editingDeal}
        onClose={handleClose}
        onSubmit={handleUpdateSubmit}
        initialValues={initialValues}
      />

      <DeleteDealDialog
        key={`delete-${deletingDeal?.id || 'none'}`}
        isOpen={!!deletingDeal}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteDeal}
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
