
import React from 'react';
import { Salon, SalonFormValues } from "../types";
import { EditSalonDialog } from "./EditSalonDialog";
import { DeleteSalonDialog } from "./DeleteSalonDialog";
import { CreateSalonDialog } from "./CreateSalonDialog";
import { SalonRatingDialog } from "./SalonRatingDialog";

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
  return (
    <>
      <EditSalonDialog
        isOpen={!!editingSalon}
        onClose={onEditClose}
        onSubmit={onUpdate}
        initialValues={editingSalon ? getInitialValuesForEdit(editingSalon) : undefined}
      />

      <DeleteSalonDialog
        isOpen={!!deletingSalon}
        onClose={onDeleteClose}
        onConfirm={onDelete}
        salonName={deletingSalon?.name}
        salonId={deletingSalon?.id}
        userId={deletingSalon?.user_id}
      />

      <CreateSalonDialog
        isOpen={isCreating}
        onClose={onCreateClose}
        onSubmit={onCreate}
      />

      <SalonRatingDialog
        salon={ratingSalon}
        isOpen={!!ratingSalon}
        onClose={onRatingClose}
        onSave={onRate}
        isSubmitting={isRating}
      />
    </>
  );
};
