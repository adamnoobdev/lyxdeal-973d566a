
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
import { FormValues } from "@/components/deal-form/schema";

export const DealsList = () => {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      try {
        setIsSubmitting(true);
        const success = await handleDelete(deletingDeal.id);
        if (success) {
          setTimeout(() => {
            setDeletingDeal(null);
            setIsSubmitting(false);
          }, 300);
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Error deleting deal:", error);
        toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
        setIsSubmitting(false);
      }
    }
  };

  const onUpdate = async (values: FormValues): Promise<void> => {
    if (editingDeal) {
      try {
        setIsSubmitting(true);
        const success = await handleUpdate(values, editingDeal.id);
        if (success) {
          setTimeout(() => {
            setEditingDeal(null);
            setIsSubmitting(false);
          }, 300);
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Error updating deal:", error);
        toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
        setIsSubmitting(false);
      }
    }
  };

  const onCreate = async (values: FormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const success = await handleCreate(values);
      if (success) {
        setTimeout(() => {
          setIsCreating(false);
          setIsSubmitting(false);
        }, 300);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas");
      setIsSubmitting(false);
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

  const handleCloseEditDialog = () => {
    if (!isSubmitting) {
      setEditingDeal(null);
      setIsCreating(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isSubmitting) {
      setDeletingDeal(null);
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

      <EditDealDialog
        isOpen={!!editingDeal || isCreating}
        onClose={handleCloseEditDialog}
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
        isSubmitting={isSubmitting}
      />

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={handleCloseDeleteDialog}
        onConfirm={onDelete}
        dealTitle={deletingDeal?.title}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
