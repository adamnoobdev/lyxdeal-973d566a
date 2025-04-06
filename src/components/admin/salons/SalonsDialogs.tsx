import React, { useEffect, useRef } from 'react';
import { Salon, SalonFormValues } from "../types";
import { EditSalonDialog } from "./EditSalonDialog";
import { DeleteSalonDialog } from "./DeleteSalonDialog";
import { CreateSalonDialog } from "./CreateSalonDialog";
import { SalonRatingDialog } from "./rating/SalonRatingDialog";

interface SalonsDialogsProps {
  editingSalon: Salon | null;
  deletingSalon: Salon | null;
  isCreating: boolean;
  ratingSalon: Salon | null;
  isRating: boolean;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onCreateClose: () => void;
  onRatingClose: () => void;
  onUpdate: (values: any) => Promise<void>;
  onDelete: () => Promise<void>;
  onCreate: (values: any) => Promise<any>;
  onRate: (salonId: number, rating: number, comment: string) => Promise<boolean>;
  getInitialValuesForEdit: (salon: Salon) => SalonFormValues;
}

export const SalonsDialogs: React.FC<SalonsDialogsProps> = ({
  editingSalon,
  deletingSalon,
  isCreating,
  ratingSalon,
  isRating,
  onEditClose,
  onDeleteClose,
  onCreateClose,
  onRatingClose,
  onUpdate,
  onDelete,
  onCreate,
  onRate,
  getInitialValuesForEdit
}) => {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    console.log("[SalonsDialogs] Rendering with states:", {
      editDialogOpen: !!editingSalon,
      deleteDialogOpen: !!deletingSalon,
      createDialogOpen: isCreating,
      ratingDialogOpen: !!ratingSalon
    });
    
    return () => {
      console.log("[SalonsDialogs] Component unmounting");
      isMountedRef.current = false;
    };
  }, [editingSalon, deletingSalon, isCreating, ratingSalon]);

  const safeHandleUpdate = async (values: any) => {
    if (isMountedRef.current) {
      await onUpdate(values);
    }
  };
  
  const safeHandleDelete = async () => {
    if (isMountedRef.current) {
      await onDelete();
    }
  };
  
  const safeHandleCreate = async (values: any) => {
    if (isMountedRef.current) {
      return await onCreate(values);
    }
    return false;
  };
  
  const safeHandleRate = async (salonId: number, rating: number, comment: string) => {
    if (isMountedRef.current) {
      return await onRate(salonId, rating, comment);
    }
    return false;
  };

  return (
    <>
      <EditSalonDialog
        key={`edit-dialog-${editingSalon?.id || 'none'}`}
        isOpen={!!editingSalon}
        onClose={onEditClose}
        onSubmit={safeHandleUpdate}
        initialValues={editingSalon ? getInitialValuesForEdit(editingSalon) : undefined}
      />

      <DeleteSalonDialog
        key={`delete-dialog-${deletingSalon?.id || 'none'}`}
        isOpen={!!deletingSalon}
        onClose={onDeleteClose}
        onConfirm={safeHandleDelete}
        salonName={deletingSalon?.name}
        salonId={deletingSalon?.id}
        userId={deletingSalon?.user_id}
      />

      <CreateSalonDialog
        key={`create-dialog-${isCreating ? 'open' : 'closed'}`}
        isOpen={isCreating}
        onClose={onCreateClose}
        onSubmit={safeHandleCreate}
      />

      <SalonRatingDialog
        key={`rating-dialog-${ratingSalon?.id || 'none'}`}
        salon={ratingSalon}
        isOpen={!!ratingSalon}
        onClose={onRatingClose}
        onSave={safeHandleRate}
        isSubmitting={isRating}
      />
    </>
  );
};
