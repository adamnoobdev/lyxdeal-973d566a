
import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSalonDealsManagement } from '@/hooks/useSalonDealsManagement';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SalonDealsError } from '@/components/admin/salons/SalonDealsError';
import { DealDialog } from './DealDialog';
import { Deal } from '@/components/admin/types';
import { DiscountCodesDialog } from '@/components/admin/deals/DiscountCodesDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealsTable } from '@/components/admin/deals/DealsTable';

export const SalonDeals: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    handleUpdate
  } = useSalonDealsManagement(id);
  
  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);

  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    setViewingCodesForDeal(deal);
  }, []);

  const handleCloseDiscountCodesDialog = useCallback(() => {
    setViewingCodesForDeal(null);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <SalonDealsError message={error} />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Hantera Erbjudande</h1>
      
      <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm p-4 mb-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Dina erbjudanden</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DealsTable
            deals={deals}
            onEdit={(deal) => setEditingDeal(deal)}
            onDelete={(deal) => setDeletingDeal(deal)}
            onViewDiscountCodes={handleViewDiscountCodes}
          />
        </CardContent>
      </Card>

      {editingDeal && (
        <DealDialog
          isOpen={!!editingDeal}
          onClose={() => setEditingDeal(null)}
          onSubmit={handleUpdate}
          initialValues={{
            title: editingDeal.title,
            description: editingDeal.description,
            imageUrl: editingDeal.image_url,
            originalPrice: editingDeal.original_price.toString(),
            discountedPrice: editingDeal.discounted_price.toString(),
            category: editingDeal.category,
            city: editingDeal.city,
            featured: editingDeal.featured,
            salon_id: editingDeal.salon_id,
            is_free: editingDeal.is_free || editingDeal.discounted_price === 0,
            is_active: editingDeal.is_active,
            quantity: editingDeal.quantity_left?.toString() || "10",
            expirationDate: editingDeal.expiration_date ? new Date(editingDeal.expiration_date) : new Date(),
          }}
        />
      )}

      <DiscountCodesDialog
        isOpen={!!viewingCodesForDeal}
        onClose={handleCloseDiscountCodesDialog}
        deal={viewingCodesForDeal}
      />
    </div>
  );
};
