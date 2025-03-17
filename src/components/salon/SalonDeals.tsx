
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
import { generateDiscountCodes } from '@/utils/discount-codes';
import { toast } from 'sonner';

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
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const [isClosingEditDialog, setIsClosingEditDialog] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);

  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    if (isProcessingAction) return;
    setViewingCodesForDeal(deal);
  }, [isProcessingAction]);

  const handleCloseDiscountCodesDialog = useCallback(() => {
    if (isProcessingAction) return;
    
    setIsClosingCodesDialog(true);
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
    }, 300);
  }, [isProcessingAction]);
  
  const handleEditDeal = useCallback((deal: Deal) => {
    if (isProcessingAction) return;
    setEditingDeal(deal);
  }, [setEditingDeal, isProcessingAction]);
  
  const handleCloseDealDialog = useCallback(() => {
    if (isProcessingAction) return;
    
    setIsClosingEditDialog(true);
    setTimeout(() => {
      setEditingDeal(null);
      setIsClosingEditDialog(false);
    }, 300);
  }, [setEditingDeal, isProcessingAction]);
  
  const handleUpdateDeal = useCallback(async (values: any) => {
    if (isProcessingAction) return;
    
    try {
      setIsProcessingAction(true);
      await handleUpdate(values);
      handleCloseDealDialog();
    } finally {
      setTimeout(() => {
        setIsProcessingAction(false);
      }, 500);
    }
  }, [handleUpdate, handleCloseDealDialog, isProcessingAction]);

  const handleGenerateDiscountCodes = useCallback(async (deal: Deal, quantity: number) => {
    if (isGeneratingCodes) return Promise.reject(new Error("Redan genererar koder"));
    
    try {
      setIsGeneratingCodes(true);
      await toast.promise(
        generateDiscountCodes(deal.id, quantity),
        {
          loading: `Genererar ${quantity} rabattkoder...`,
          success: `${quantity} rabattkoder genererades för "${deal.title}"`,
          error: 'Kunde inte generera rabattkoder'
        }
      );
      return Promise.resolve();
    } catch (error) {
      console.error("[SalonDeals] Error generating discount codes:", error);
      return Promise.reject(error);
    } finally {
      setIsGeneratingCodes(false);
    }
  }, [isGeneratingCodes]);

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
            onEdit={handleEditDeal}
            onDelete={(deal) => setDeletingDeal(deal)}
            onViewDiscountCodes={handleViewDiscountCodes}
            onGenerateDiscountCodes={handleGenerateDiscountCodes}
            isGeneratingCodes={isGeneratingCodes}
            isSalonView={true}
          />
        </CardContent>
      </Card>

      {editingDeal && (
        <DealDialog
          isOpen={!!editingDeal && !isClosingEditDialog}
          onClose={handleCloseDealDialog}
          onSubmit={handleUpdateDeal}
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
        isOpen={!!viewingCodesForDeal && !isClosingCodesDialog}
        onClose={handleCloseDiscountCodesDialog}
        deal={viewingCodesForDeal}
        onGenerateDiscountCodes={handleGenerateDiscountCodes}
      />
    </div>
  );
};
