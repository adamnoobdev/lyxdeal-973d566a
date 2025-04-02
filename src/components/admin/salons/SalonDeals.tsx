
import { useParams } from "react-router-dom";
import { DealsTable } from "../deals/DealsTable";
import { EditDealDialog } from "../deals/EditDealDialog";
import { DeleteDealDialog } from "../deals/DeleteDealDialog";
import { DealsLoadingSkeleton } from "../deals/DealsLoadingSkeleton";
import { SalonDealsError } from "./SalonDealsError";
import { SalonDealsEmpty } from "./SalonDealsEmpty";
import { useSalonDealsManagement } from "@/hooks/salon-deals-management";
import { endOfMonth } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useCallback, memo, useMemo, useState } from "react";
import { Deal } from "@/components/admin/types";
import { DiscountCodesDialog } from "../deals/DiscountCodesDialog";

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

  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    setViewingCodesForDeal(deal);
  }, []);

  const handleCloseDiscountCodesDialog = useCallback(() => {
    setViewingCodesForDeal(null);
  }, []);
  
  const handleUpdateSubmit = useCallback(async (values: any) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await handleUpdate(values);
    } finally {
      setIsSubmitting(false);
      // Use setTimeout to delay state update to next event loop
      setTimeout(() => {
        handleClose();
      }, 0);
    }
  }, [handleUpdate, handleClose, isSubmitting]);
  
  // Använd useMemo för att förhindra onödiga beräkningar vid re-renders
  const initialValues = useMemo(() => {
    if (!editingDeal) return undefined;
    
    return {
      title: editingDeal.title,
      description: editingDeal.description,
      imageUrl: editingDeal.image_url,
      originalPrice: editingDeal.original_price.toString(),
      // Set discounted price to "0" for free deals regardless of actual stored value
      discountedPrice: editingDeal.is_free ? "0" : editingDeal.discounted_price.toString(),
      category: editingDeal.category,
      city: editingDeal.city,
      featured: editingDeal.featured,
      salon_id: editingDeal.salon_id,
      is_free: editingDeal.is_free || false,
      is_active: editingDeal.is_active,
      quantity: editingDeal.quantity_left?.toString() || "10",
      expirationDate: editingDeal.expiration_date 
        ? new Date(editingDeal.expiration_date) 
        : endOfMonth(new Date()),
    };
  }, [editingDeal]);

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
      <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm p-2 sm:p-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4 w-full max-w-md bg-secondary/10 border border-secondary/30">
            <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-xs sm:text-sm">
              Aktiva erbjudanden ({activeDeals.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-xs sm:text-sm">
              Inaktiva erbjudanden ({inactiveDeals.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <MemoizedDealsTable
              deals={activeDeals}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleActive={handleToggleActive}
              onViewDiscountCodes={handleViewDiscountCodes}
            />
          </TabsContent>
          
          <TabsContent value="inactive">
            <MemoizedDealsTable
              deals={inactiveDeals}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleActive={handleToggleActive}
              onViewDiscountCodes={handleViewDiscountCodes}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <EditDealDialog
        isOpen={!!editingDeal}
        onClose={handleClose}
        onSubmit={handleUpdateSubmit}
        initialValues={initialValues}
      />

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteDeal}
        dealTitle={deletingDeal?.title}
      />

      <DiscountCodesDialog
        isOpen={!!viewingCodesForDeal}
        onClose={handleCloseDiscountCodesDialog}
        deal={viewingCodesForDeal}
      />
    </>
  );
}
