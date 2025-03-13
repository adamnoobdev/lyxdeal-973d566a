
import { useParams } from "react-router-dom";
import { DealsTable } from "../deals/DealsTable";
import { EditDealDialog } from "../deals/EditDealDialog";
import { DeleteDealDialog } from "../deals/DeleteDealDialog";
import { DealsLoadingSkeleton } from "../deals/DealsLoadingSkeleton";
import { SalonDealsError } from "./SalonDealsError";
import { SalonDealsEmpty } from "./SalonDealsEmpty";
import { useSalonDealsManagement } from "@/hooks/useSalonDealsManagement";
import { endOfMonth } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useCallback, memo } from "react";

// Memoize the component to prevent unnecessary re-renders
const MemoizedDealsTable = memo(DealsTable);

export function SalonDeals() {
  const { salonId } = useParams();
  const {
    deals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error,
    editingDeal,
    deletingDeal,
    setEditingDeal,
    setDeletingDeal,
    handleDelete: handleDeleteDeal,
    handleUpdate,
    handleToggleActive,
  } = useSalonDealsManagement(salonId);

  const handleEdit = useCallback((deal) => {
    setEditingDeal(deal);
  }, [setEditingDeal]);

  const handleDeleteClick = useCallback((deal) => {
    setDeletingDeal(deal);
  }, [setDeletingDeal]);

  const handleClose = useCallback(() => {
    setEditingDeal(null);
  }, [setEditingDeal]);

  const handleCloseDelete = useCallback(() => {
    setDeletingDeal(null);
  }, [setDeletingDeal]);

  if (isLoading) {
    return <DealsLoadingSkeleton />;
  }

  if (error) {
    return <SalonDealsError message={error} />;
  }

  if (!deals?.length) {
    return <SalonDealsEmpty />;
  }

  return (
    <>
      <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm p-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4 w-full max-w-md bg-secondary/10 border border-secondary/30">
            <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Aktiva erbjudanden ({activeDeals.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Inaktiva erbjudanden ({inactiveDeals.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <MemoizedDealsTable
              deals={activeDeals}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleActive={handleToggleActive}
            />
          </TabsContent>
          
          <TabsContent value="inactive">
            <MemoizedDealsTable
              deals={inactiveDeals}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleActive={handleToggleActive}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <EditDealDialog
        isOpen={!!editingDeal}
        onClose={handleClose}
        onSubmit={handleUpdate}
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
        onClose={handleCloseDelete}
        onConfirm={handleDeleteDeal}
        dealTitle={deletingDeal?.title}
      />
    </>
  );
}
