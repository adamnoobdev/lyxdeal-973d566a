
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSalonDealsManagement } from '@/hooks/useSalonDealsManagement';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SalonDealsError } from '@/components/admin/salons/SalonDealsError';
import { DealDialog } from './DealDialog';

export const SalonDeals: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    deals, 
    isLoading, 
    error,
    editingDeal,
    deletingDeal,
    setEditingDeal,
    setDeletingDeal,
    handleDelete,
    handleUpdate
  } = useSalonDealsManagement(id);
  
  // Use the first deal for display if available
  const currentDeal = deals && deals.length > 0 ? deals[0] : null;

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
      
      {currentDeal && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-2">{currentDeal.title}</h2>
          <p className="text-gray-600 mb-4">{currentDeal.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button variant="outline" onClick={() => setEditingDeal(currentDeal)}>Redigera erbjudande</Button>
            <Button variant="destructive" onClick={() => setDeletingDeal(currentDeal)}>Ta bort erbjudande</Button>
          </div>
        </div>
      )}

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
    </div>
  );
};
