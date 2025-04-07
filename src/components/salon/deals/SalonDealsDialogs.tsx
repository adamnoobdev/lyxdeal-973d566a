
import React from 'react';
import { DealDialog } from '../DealDialog';
import { DiscountCodesDialog } from '@/components/admin/deals/DiscountCodesDialog';
import { Deal } from '@/components/admin/types';
import { FormValues } from '@/components/deal-form/schema';
import { endOfMonth } from 'date-fns';

interface SalonDealsDialogsProps {
  editingDeal: Deal | null;
  isDialogOpen: boolean;
  onCloseDealDialog: () => void;
  onUpdateDeal: (values: FormValues) => Promise<void>;
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
  
  // Transform deal data to form values format
  const dealToFormValues = (deal: Deal | null): Partial<FormValues> => {
    if (!deal) return {};
    
    return {
      title: deal.title,
      description: deal.description,
      imageUrl: deal.image_url,
      originalPrice: deal.original_price.toString(),
      discountedPrice: deal.is_free ? "0" : deal.discounted_price.toString(),
      category: deal.category,
      city: deal.city,
      featured: deal.featured,
      salon_id: deal.salon_id,
      is_free: deal.is_free || false,
      is_active: deal.is_active,
      quantity: deal.quantity_left?.toString() || "10",
      expirationDate: deal.expiration_date ? new Date(deal.expiration_date) : endOfMonth(new Date()),
      booking_url: deal.booking_url || "",
      requires_discount_code: deal.requires_discount_code
    };
  };

  return (
    <>
      {/* Deal creation/editing dialog */}
      <DealDialog
        isOpen={isDialogOpen}
        onClose={onCloseDealDialog}
        onSubmit={onUpdateDeal}
        initialValues={dealToFormValues(editingDeal)}
      />

      {/* Discount codes dialog */}
      <DiscountCodesDialog
        isOpen={isDiscountCodesDialogOpen}
        onClose={onCloseDiscountCodesDialog}
        deal={viewingCodesForDeal}
        onGenerateDiscountCodes={onGenerateDiscountCodes}
      />
    </>
  );
};
