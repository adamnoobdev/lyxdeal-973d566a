
import { memo } from "react";
import { EditDealDialog } from "./EditDealDialog";
import { DeleteDealDialog } from "./DeleteDealDialog";
import { Deal } from "../types";
import { FormValues } from "@/components/deal-form/schema";
import { endOfMonth } from "date-fns";

interface DealsDialogsProps {
  editingDeal: Deal | null;
  deletingDeal: Deal | null;
  isCreating: boolean;
  onClose: () => void;
  onUpdate: (values: FormValues) => Promise<void>;
  onCreate: (values: FormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

const DealsDialogsComponent = ({
  editingDeal,
  deletingDeal,
  isCreating,
  onClose,
  onUpdate,
  onCreate,
  onDelete,
}: DealsDialogsProps) => {
  return (
    <>
      <EditDealDialog
        isOpen={!!editingDeal || isCreating}
        onClose={onClose}
        onSubmit={editingDeal ? onUpdate : onCreate}
        initialValues={
          editingDeal
            ? {
                title: editingDeal.title,
                description: editingDeal.description,
                imageUrl: editingDeal.image_url,
                originalPrice: editingDeal.original_price.toString(),
                discountedPrice: editingDeal.discounted_price.toString(),
                category: editingDeal.category,
                city: editingDeal.city,
                featured: editingDeal.featured,
                salon_id: editingDeal.salon_id,
                is_free: editingDeal.is_free || false,
                is_active: editingDeal.is_active,
                quantity: editingDeal.quantity_left?.toString() || "10",
                expirationDate: editingDeal.expiration_date ? new Date(editingDeal.expiration_date) : endOfMonth(new Date()),
              }
            : undefined
        }
      />

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={onClose}
        onConfirm={onDelete}
        dealTitle={deletingDeal?.title}
      />
    </>
  );
};

export const DealsDialogs = memo(DealsDialogsComponent);
