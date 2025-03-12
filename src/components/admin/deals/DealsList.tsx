import { useState } from "react";
import { Deal } from "../types";
import { EditDealDialog } from "./EditDealDialog";
import { DeleteDealDialog } from "./DeleteDealDialog";
import { DealsLoadingSkeleton } from "./DealsLoadingSkeleton";
import { DealsHeader } from "./DealsHeader";
import { PendingDealsSection } from "./PendingDealsSection";
import { DealsTabsSection } from "./DealsTabsSection";
import { useDealsAdmin } from "@/hooks/useDealsAdmin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { endOfMonth } from "date-fns";

export const DealsList = () => {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    deals, 
    activeDeals,
    inactiveDeals,
    isLoading, 
    error, 
    handleDelete, 
    handleUpdate, 
    handleCreate, 
    handleToggleActive,
    refetch 
  } = useDealsAdmin();

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
        setTimeout(() => {
          refetch();
        }, 200);
      }
    }
  };

  const onCreate = async (values: any) => {
    const success = await handleCreate(values);
    if (success) {
      setIsCreating(false);
      setTimeout(() => {
        refetch();
      }, 200);
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

  return (
    <div className="space-y-6">
      <DealsHeader onCreateClick={() => setIsCreating(true)} />

      <div className="space-y-6">
        {pendingDeals.length > 0 && (
          <PendingDealsSection 
            pendingDeals={pendingDeals}
            setEditingDeal={setEditingDeal}
            setDeletingDeal={setDeletingDeal}
            handleToggleActive={handleToggleActive}
            handleStatusChange={handleStatusChange}
          />
        )}

        <DealsTabsSection 
          activeDeals={activeDeals}
          inactiveDeals={inactiveDeals}
          setEditingDeal={setEditingDeal}
          setDeletingDeal={setDeletingDeal}
          handleToggleActive={handleToggleActive}
        />
      </div>

      {(!!editingDeal || isCreating) && (
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
      )}

      {!!deletingDeal && (
        <DeleteDealDialog
          isOpen={!!deletingDeal}
          onClose={() => setDeletingDeal(null)}
          onConfirm={onDelete}
          dealTitle={deletingDeal?.title}
        />
      )}
    </div>
  );
};
