
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
  console.log("[DealsDialogs] Rendering with:", {
    isEditing: !!editingDeal,
    isCreating,
    isDeleting: !!deletingDeal
  });

  return (
    <>
      {(!!editingDeal || isCreating) && (
        <EditDealDialog
          isOpen={true}
          onClose={onClose}
          onSubmit={editingDeal ? onUpdate : onCreate}
          initialValues={
            editingDeal
              ? {
                  title: editingDeal.title,
                  description: editingDeal.description,
                  imageUrl: editingDeal.image_url,
                  originalPrice: editingDeal.original_price.toString(),
                  // Set discounted price to "0" for free deals regardless of actual stored value
                  discountedPrice: editingDeal.is_free ? "0" : editingDeal.discounted_price.toString(),
                  category: editingDeal.category,
                  city: editingDeal.city,
                  featured: editingDeal.featured,
                  salon_id: editingDeal.salon_id,
                  is_free: editingDeal.is_free || false,
                  is_active: editingDeal.is_active,
                  quantity: editingDeal.quantity_left?.toString() || "10",
                  booking_url: editingDeal.booking_url || "",
                  expirationDate: editingDeal.expiration_date ? new Date(editingDeal.expiration_date) : endOfMonth(new Date()),
                }
              : undefined
          }
        />
      )}

      {!!deletingDeal && (
        <DeleteDealDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={onDelete}
          dealTitle={deletingDeal?.title}
        />
      )}
    </>
  );
};

export const DealsDialogs = memo(DealsDialogsComponent);
