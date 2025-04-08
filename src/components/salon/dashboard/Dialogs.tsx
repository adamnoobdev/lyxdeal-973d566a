
import { Deal } from "@/types/deal";
import { DealDialog } from "../DealDialog"; // Correct import path
import { PasswordChangeDialog } from "../password-change/PasswordChangeDialog";
import { DiscountCodesDialog } from "@/components/admin/deals/DiscountCodesDialog";
import { DeleteDealDialog } from "@/components/admin/deals/DeleteDealDialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface DashboardDialogsProps {
  isCreateDialogOpen: boolean;
  onCloseCreateDialog: () => void;
  onCreate: (values: any) => Promise<void>;
  editingDeal: Deal | null;
  onCloseEditDialog: () => void;
  onUpdate: (values: any) => Promise<void>;
  showPasswordDialog: boolean;
  onClosePasswordDialog: () => void;
  viewingCodesForDeal: Deal | null;
  isClosingCodesDialog: boolean;
  onCloseCodesDialog: () => void;
  deletingDeal?: Deal | null;
  onDeleteConfirm?: (deal: Deal) => Promise<void>;
  onCloseDeleteDialog?: () => void;
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
  deletingDeal,
  onDeleteConfirm,
  onCloseDeleteDialog,
  isFirstLogin = false,
}: DashboardDialogsProps) => {
  // Vi tar bort PasswordChangeDialog härifrån eftersom den hanteras av SalonAuthGuard
  // för att undvika dubbletter och inkonsekvent hantering
  return (
    <>
      {/* Skapa nytt deal */}
      {isCreateDialogOpen && (
        <DealDialog
          isOpen={isCreateDialogOpen}
          onClose={onCloseCreateDialog}
          onSubmit={onCreate}
        />
      )}

      {/* Redigera deal */}
      {editingDeal && (
        <DealDialog
          isOpen={!!editingDeal}
          onClose={onCloseEditDialog}
          onSubmit={onUpdate}
          initialValues={editingDeal}
        />
      )}

      {/* Visa rabattkoder */}
      {viewingCodesForDeal && (
        <Sheet 
          open={!!viewingCodesForDeal && !isClosingCodesDialog} 
          onOpenChange={(open) => !open && onCloseCodesDialog()}
        >
          <SheetContent className="sm:max-w-lg">
            <DiscountCodesDialog 
              deal={viewingCodesForDeal} 
              onClose={onCloseCodesDialog}
              isOpen={!!viewingCodesForDeal && !isClosingCodesDialog}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Radera deal */}
      {deletingDeal && onDeleteConfirm && onCloseDeleteDialog && (
        <DeleteDealDialog
          isOpen={!!deletingDeal}
          onClose={onCloseDeleteDialog}
          onConfirm={() => onDeleteConfirm(deletingDeal)}
          dealTitle={deletingDeal.title}
        />
      )}
    </>
  );
};
