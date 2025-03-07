
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
import { endOfMonth } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    return (
      <div className="space-y-8 p-4 md:p-8">
        <DealsLoadingSkeleton />
      </div>
    );
  }

  if (error) return (
    <div className="p-4 md:p-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : "Ett fel uppstod när erbjudanden skulle hämtas"}
        </AlertDescription>
      </Alert>
    </div>
  );

  const pendingDeals = deals?.filter(deal => deal.status === 'pending') || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Erbjudanden</h1>
          <p className="text-muted-foreground mt-1">Hantera och övervaka alla erbjudanden</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Skapa erbjudande
        </Button>
      </div>

      <div className="space-y-6">
        {pendingDeals.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Väntande godkännande</h2>
              <Badge variant="secondary">{pendingDeals.length}</Badge>
            </div>
            <div className="overflow-x-auto rounded-lg border bg-background">
              <DealsTable
                deals={pendingDeals}
                onEdit={setEditingDeal}
                onDelete={setDeletingDeal}
                onToggleActive={handleToggleActive}
                showApprovalActions
                onApprove={(dealId) => handleStatusChange(dealId, 'approved')}
                onReject={(dealId) => handleStatusChange(dealId, 'rejected')}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active">
                Aktiva erbjudanden ({activeDeals.length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inaktiva erbjudanden ({inactiveDeals.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {!activeDeals.length ? (
                <Alert>
                  <AlertDescription>
                    Inga aktiva erbjudanden hittades. Skapa ditt första erbjudande genom att klicka på "Skapa erbjudande" ovan.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto rounded-lg border bg-background">
                  <DealsTable
                    deals={activeDeals}
                    onEdit={setEditingDeal}
                    onDelete={setDeletingDeal}
                    onToggleActive={handleToggleActive}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="inactive">
              {!inactiveDeals.length ? (
                <Alert>
                  <AlertDescription>
                    Inga inaktiva erbjudanden hittades.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto rounded-lg border bg-background">
                  <DealsTable
                    deals={inactiveDeals}
                    onEdit={setEditingDeal}
                    onDelete={setDeletingDeal}
                    onToggleActive={handleToggleActive}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
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
}
