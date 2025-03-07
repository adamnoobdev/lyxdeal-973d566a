
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
    handleDelete,
    handleUpdate,
    handleToggleActive,
  } = useSalonDealsManagement(salonId);

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
          <DealsTable
            deals={activeDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>
        
        <TabsContent value="inactive">
          <DealsTable
            deals={inactiveDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>
      </Tabs>

      <EditDealDialog
        isOpen={!!editingDeal}
        onClose={() => setEditingDeal(null)}
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
        onClose={() => setDeletingDeal(null)}
        onConfirm={handleDelete}
        dealTitle={deletingDeal?.title}
      />
    </>
  );
}
