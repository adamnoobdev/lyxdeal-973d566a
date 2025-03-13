import { useState, useCallback, useRef } from "react";
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
  const isUpdatingDealRef = useRef(false);
  const isDeletingDealRef = useRef(false);
  
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

  const onDelete = useCallback(async () => {
    if (deletingDeal && !isDeletingDealRef.current) {
      try {
        isDeletingDealRef.current = true;
        console.log("Starting deal deletion for ID:", deletingDeal.id);
        const success = await handleDelete(deletingDeal.id);
        
        if (success) {
          console.log("Deal deletion successful");
          setDeletingDeal(null);
        }
      } catch (error) {
        console.error("Error in deal deletion flow:", error);
      } finally {
        isDeletingDealRef.current = false;
      }
    } else {
      console.log("Delete operation already in progress or no deal to delete");
    }
  }, [deletingDeal, handleDelete]);

  const onUpdate = useCallback(async (values: any) => {
    if (editingDeal && !isUpdatingDealRef.current) {
      try {
        isUpdatingDealRef.current = true;
        console.log("Starting deal update for ID:", editingDeal.id);
        const success = await handleUpdate(values, editingDeal.id);
        
        if (success) {
          console.log("Deal update successful");
          setEditingDeal(null);
        }
      } catch (error) {
        console.error("Error in deal update flow:", error);
      } finally {
        isUpdatingDealRef.current = false;
      }
    } else {
      console.log("Update operation already in progress or no deal to update");
    }
  }, [editingDeal, handleUpdate]);

  const onCreate = useCallback(async (values: any) => {
    if (!isUpdatingDealRef.current) {
      try {
        isUpdatingDealRef.current = true;
        console.log("Starting deal creation");
        const success = await handleCreate(values);
        
        if (success) {
          console.log("Deal creation successful");
          setIsCreating(false);
        }
      } catch (error) {
        console.error("Error in deal creation flow:", error);
      } finally {
        isUpdatingDealRef.current = false;
      }
    } else {
      console.log("Create operation already in progress");
    }
  }, [handleCreate]);

  const handleStatusChange = useCallback(async (dealId: number, newStatus: 'approved' | 'rejected') => {
    try {
      console.log(`Changing deal status for ID ${dealId} to ${newStatus}`);
      const { error } = await supabase
        .from('deals')
        .update({ status: newStatus })
        .eq('id', dealId);

      if (error) throw error;

      toast.success(`Erbjudandet har ${newStatus === 'approved' ? 'godkänts' : 'nekats'}`);
      console.log("Status change successful, refetching deals");
      await refetch();
    } catch (error) {
      console.error('Error updating deal status:', error);
      toast.error('Något gick fel när statusen skulle uppdateras');
    }
  }, [refetch]);

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

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={onDelete}
        dealTitle={deletingDeal?.title}
      />
    </div>
  );
};
