
import React from 'react';
import { DealDialog } from '@/components/salon/DealDialog';
import { DiscountCodesDialog } from '@/components/admin/deals/DiscountCodesDialog';
import { Deal } from '@/components/admin/types';
import { FormValues } from '@/components/deal-form/schema';

export interface SalonDealsDialogsProps {
  editingDeal: Deal | null;
  isDialogOpen: boolean;
  onCloseDealDialog: () => void;
  onUpdateDeal: (values: FormValues) => Promise<void>;
  onCreateDeal: (values: FormValues) => Promise<void>;
  isCodesDialogOpen: boolean;
  viewingCodesFor: Deal | null;
  onCloseCodesDialog: () => void;
  onGenerateDiscountCodes: (deal: Deal, quantity: number) => Promise<void>;
  isGeneratingCodes: boolean;
}

export const SalonDealsDialogs: React.FC<SalonDealsDialogsProps> = ({
  editingDeal,
  isDialogOpen,
  onCloseDealDialog,
  onUpdateDeal,
  onCreateDeal,
  isCodesDialogOpen,
  viewingCodesFor,
  onCloseCodesDialog,
  onGenerateDiscountCodes,
  isGeneratingCodes
}) => {
  return (
    <>
      <DealDialog 
        key={`deal-dialog-${editingDeal?.id || 'new'}`}
        isOpen={isDialogOpen}
        onClose={onCloseDealDialog}
        onSubmit={editingDeal ? onUpdateDeal : onCreateDeal}
        deal={editingDeal}
      />
      
      <DiscountCodesDialog 
        key={`codes-dialog-${viewingCodesFor?.id || 'none'}`}
        isOpen={isCodesDialogOpen} 
        onClose={onCloseCodesDialog}
        deal={viewingCodesFor}
        onGenerateDiscountCodes={onGenerateDiscountCodes}
      />
    </>
  );
};
