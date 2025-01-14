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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const DealsList = () => {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { deals, isLoading, error, handleDelete, handleUpdate, handleCreate, refetch } = useDealsAdmin();

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

  const handleStatusChange = async (dealId: number, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ status: newStatus })
        .eq('id', dealId);

      if (error) throw error;

      toast.success(`Erbjudandet har ${newStatus === 'approved' ? 'godkänts' : 'nekats'}`);
      refetch();
    } catch (error) {
      console.error('Error updating deal status:', error);
      toast.error('Något gick fel när statusen skulle uppdateras');
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

  const pendingDeals = deals?.filter(deal => deal.status === 'pending') || [];
  const otherDeals = deals?.filter(deal => deal.status !== 'pending') || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Erbjudanden</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Skapa erbjudande
        </Button>
      </div>

      {pendingDeals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Väntande godkännande</h2>
          <DealsTable
            deals={pendingDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
            showApprovalActions
            onApprove={(dealId) => handleStatusChange(dealId, 'approved')}
            onReject={(dealId) => handleStatusChange(dealId, 'rejected')}
          />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alla erbjudanden</h2>
        {!otherDeals.length ? (
          <Alert>
            <AlertDescription>
              Inga erbjudanden hittades. Skapa ditt första erbjudande genom att klicka på "Skapa erbjudande" ovan.
            </AlertDescription>
          </Alert>
        ) : (
          <DealsTable
            deals={otherDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
          />
        )}
      </div>

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
                salon_id: editingDeal.salon_id,
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