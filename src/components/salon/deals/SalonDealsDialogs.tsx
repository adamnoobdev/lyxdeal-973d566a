
import React from 'react';
import { DealDialog } from '../DealDialog';
import { DiscountCodesDialog } from '@/components/admin/deals/DiscountCodesDialog';
import { Deal } from '@/components/admin/types';

interface SalonDealsDialogsProps {
  editingDeal: Deal | null;
  isDialogOpen: boolean;
  onCloseDealDialog: () => void;
  onUpdateDeal: (values: any) => Promise<void>;
  viewingCodesForDeal: Deal | null;
  isClosingCodesDialog: boolean;
  onCloseDiscountCodesDialog: () => void;
  onGenerateDiscountCodes: (deal: Deal, quantity: number) => Promise<void>;
}

export const SalonDealsDialogs: React.FC<SalonDealsDialogsProps> = ({
  editingDeal,
  isDialogOpen,
  onCloseDealDialog,
  onUpdateDeal,
  viewingCodesForDeal,
  isClosingCodesDialog,
  onCloseDiscountCodesDialog,
  onGenerateDiscountCodes
}) => {
  const isDiscountCodesDialogOpen = !!viewingCodesForDeal && !isClosingCodesDialog;

  return (
    <>
      {/* Visa dialogen både för redigering OCH för att skapa nya erbjudanden */}
      <DealDialog
        isOpen={isDialogOpen}
        onClose={onCloseDealDialog}
        onSubmit={onUpdateDeal}
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
          is_free: editingDeal.is_free || editingDeal.discounted_price === 0,
          is_active: editingDeal.is_active,
          quantity: editingDeal.quantity_left?.toString() || "10",
          expirationDate: editingDeal.expiration_date ? new Date(editingDeal.expiration_date) : new Date(),
          booking_url: editingDeal.booking_url || "",
          requires_discount_code: editingDeal.requires_discount_code
        } : {}}
      />

      <DiscountCodesDialog
        isOpen={isDiscountCodesDialogOpen}
        onClose={onCloseDiscountCodesDialog}
        deal={viewingCodesForDeal}
        onGenerateDiscountCodes={onGenerateDiscountCodes}
      />
    </>
  );
};
