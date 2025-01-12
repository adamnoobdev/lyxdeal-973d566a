import { useState } from "react";
import { Deal } from "./types";
import { DealsTable } from "./deals/DealsTable";
import { EditDealDialog } from "./deals/EditDealDialog";
import { DeleteDealDialog } from "./deals/DeleteDealDialog";
import { DealsLoadingSkeleton } from "./deals/DealsLoadingSkeleton";
import { useDealsAdmin } from "@/hooks/useDealsAdmin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DealsList = () => {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { deals, isLoading, error, handleDelete, handleUpdate, handleCreate } = useDealsAdmin();

  const onDelete = async () => {
    if (deletingDeal) {
      const success = await handleDelete(deletingDeal.id);
      if (success) {
        setDeletingDeal(null);
      }
    }
  };

  const onUpdate = async (values: any) => {
    if (editingDeal) {
      const success = await handleUpdate(values, editingDeal.id);
      if (success) {
        setEditingDeal(null);
      }
    }
  };

  const onCreate = async (values: any) => {
    const success = await handleCreate(values);
    if (success) {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <DealsLoadingSkeleton />;
  }

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error instanceof Error ? error.message : "Ett fel uppstod när erbjudanden skulle hämtas"}
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Erbjudanden</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Skapa erbjudande
        </Button>
      </div>

      {!deals?.length ? (
        <Alert>
          <AlertDescription>
            Inga erbjudanden hittades. Skapa ditt första erbjudande genom att klicka på "Skapa erbjudande" ovan.
          </AlertDescription>
        </Alert>
      ) : (
        <DealsTable
          deals={deals}
          onEdit={setEditingDeal}
          onDelete={setDeletingDeal}
        />
      )}

      <EditDealDialog
        isOpen={!!editingDeal || isCreating}
        onClose={() => {
          setEditingDeal(null);
          setIsCreating(false);
        }}
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
                timeRemaining: editingDeal.time_remaining,
                featured: editingDeal.featured,
              }
            : undefined
        }
      />

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={onDelete}
        dealTitle={deletingDeal?.title}
      />
    </div>
  );
};