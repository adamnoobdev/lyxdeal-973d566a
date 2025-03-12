
import { useState, useEffect } from "react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  // Clean up processing state when component unmounts
  useEffect(() => {
    return () => {
      setIsProcessing(false);
    };
  }, []);

  const onDelete = async () => {
    if (deletingDeal && !isProcessing) {
      try {
        setIsProcessing(true);
        const success = await handleDelete(deletingDeal.id);
        if (success) {
          // Delay cleanup to ensure animations complete
          setTimeout(() => {
            setDeletingDeal(null);
            setIsProcessing(false);
            // Additional delay before refetching
            setTimeout(() => {
              refetch();
            }, 300);
          }, 300);
        } else {
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Error during delete:", error);
        setIsProcessing(false);
        toast.error("Ett fel uppstod vid borttagning");
      }
    }
  };

  const onUpdate = async (values: any) => {
    if (editingDeal && !isProcessing) {
      try {
        setIsProcessing(true);
        const success = await handleUpdate(values, editingDeal.id);
        if (success) {
          // Success handled in EditDealDialog
          setTimeout(() => {
            refetch();
          }, 600);
        }
      } catch (error) {
        console.error("Error during update:", error);
        setIsProcessing(false);
        toast.error("Ett fel uppstod vid uppdatering");
      }
    }
  };

  const onCreate = async (values: any) => {
    if (!isProcessing) {
      try {
        setIsProcessing(true);
        const success = await handleCreate(values);
        if (success) {
          // Success handled in EditDealDialog
          setTimeout(() => {
            refetch();
          }, 600);
        }
      } catch (error) {
        console.error("Error during create:", error);
        setIsProcessing(false);
        toast.error("Ett fel uppstod vid skapande");
      }
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
      // Delay refetch after status change
      setTimeout(() => {
        refetch();
      }, 300);
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

  const handleCloseDialog = () => {
    // Ensure we don't set state if we're in processing mode
    if (!isProcessing) {
      setEditingDeal(null);
      setIsCreating(false);
      setDeletingDeal(null);
      // Reset processing state after dialog is closed
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    }
  };

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
          onClose={handleCloseDialog}
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
          onClose={handleCloseDialog}
          onConfirm={onDelete}
          dealTitle={deletingDeal?.title}
        />
      )}
    </div>
  );
};
