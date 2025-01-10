import { useState } from "react";
import { Deal } from "./types";
import { DealsTable } from "./deals/DealsTable";
import { EditDealDialog } from "./deals/EditDealDialog";
import { DeleteDealDialog } from "./deals/DeleteDealDialog";
import { DealsLoadingSkeleton } from "./deals/DealsLoadingSkeleton";
import { useDealsAdmin } from "@/hooks/useDealsAdmin";

export const DealsList = () => {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const { deals, isLoading, error, handleDelete, handleUpdate } = useDealsAdmin();

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

  if (isLoading) {
    return <DealsLoadingSkeleton />;
  }

  if (error) return (
    <div className="text-center py-8 text-red-500">
      Ett fel uppstod när erbjudanden skulle hämtas
    </div>
  );

  return (
    <>
      <DealsTable
        deals={deals || []}
        onEdit={setEditingDeal}
        onDelete={setDeletingDeal}
      />

      <EditDealDialog
        isOpen={!!editingDeal}
        onClose={() => setEditingDeal(null)}
        onSubmit={onUpdate}
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
    </>
  );
};