import React from "react";
import { Deal } from "@/components/admin/types";
import { DealDialog } from "@/components/salon/DealDialog";
import { PasswordChangeDialog } from "@/components/salon/password-change/PasswordChangeDialog";
import { DiscountCodesDialog } from "@/components/admin/deals/DiscountCodesDialog";
import { FormValues } from "@/components/deal-form/schema";
import { endOfMonth } from "date-fns";

interface DialogsProps {
  isCreateDialogOpen: boolean;
  onCloseCreateDialog: () => void;
  onCreate: (values: FormValues) => Promise<void>;
  editingDeal: Deal | null;
  onCloseEditDialog: () => void;
  onUpdate: (values: FormValues) => Promise<void>;
  showPasswordDialog: boolean;
  onClosePasswordDialog: () => void;
  viewingCodesForDeal: Deal | null;
  isClosingCodesDialog: boolean;
  onCloseCodesDialog: () => void;
  isFirstLogin?: boolean;
}

export const DashboardDialogs = ({
  isCreateDialogOpen,
  onCloseCreateDialog,
  onCreate,
  editingDeal,
  onCloseEditDialog,
  onUpdate,
  showPasswordDialog,
  onClosePasswordDialog,
  viewingCodesForDeal,
  isClosingCodesDialog,
  onCloseCodesDialog,
  isFirstLogin = false
}: DialogsProps) => {
  return (
    <>
      {/* Dialog för att skapa erbjudande */}
      <DealDialog
        isOpen={isCreateDialogOpen}
        onClose={onCloseCreateDialog}
        onSubmit={onCreate}
      />

      {/* Dialog för att redigera erbjudande */}
      <DealDialog
        isOpen={!!editingDeal}
        onClose={onCloseEditDialog}
        onSubmit={onUpdate}
        initialValues={editingDeal ? {
          title: editingDeal.title,
          description: editingDeal.description,
          imageUrl: editingDeal.image_url,
          originalPrice: editingDeal.original_price.toString(),
          discountedPrice: editingDeal.discounted_price.toString(),
          category: editingDeal.category,
          city: editingDeal.city,
          featured: editingDeal.featured,
          salon_id: editingDeal.salon_id,
          is_free: editingDeal.is_free,
          quantity: editingDeal.quantity_left?.toString() || "10",
          booking_url: editingDeal.booking_url || "",
          requires_discount_code: editingDeal.requires_discount_code !== false,
          expirationDate: editingDeal.expiration_date ? new Date(editingDeal.expiration_date) : endOfMonth(new Date()),
        } : undefined}
      />

      {/* Dialog för lösenordsbyte */}
      <PasswordChangeDialog
        isOpen={showPasswordDialog}
        onClose={onClosePasswordDialog}
        isFirstLogin={isFirstLogin}
      />

      {/* Dialog för rabattkoder */}
      <DiscountCodesDialog
        isOpen={!!viewingCodesForDeal && !isClosingCodesDialog}
        onClose={onCloseCodesDialog}
        deal={viewingCodesForDeal}
      />
    </>
  );
};
