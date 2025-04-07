
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DealsSection } from '@/components/salon/DealsSection';
import { SalonDealsDialogs } from '@/components/salon/deals/SalonDealsDialogs';
import { useSalonDeals } from '@/hooks/salon-deals';
import { FormValues } from '@/components/deal-form/schema';
import { Deal } from '@/components/admin/types';
import { Skeleton } from '@/components/ui/skeleton';
import { SalonDealsContent } from '@/components/salon/deals/SalonDealsContent';
import { useSalonDealsState } from '@/components/salon/deals/useSalonDealsState';
import { useDealHandlers } from '@/components/salon/deals/useDealHandlers';

export const SalonDeals = () => {
  const {
    deals = [],
    activeDeals = [],
    inactiveDeals = [],
    isLoading,
    error,
    refetch
  } = useSalonDeals(0); // Pass default salon ID or get from context
  
  const {
    editingDeal,
    setEditingDeal,
    isDialogOpen,
    setIsDialogOpen,
    viewingCodesForDeal,
    setViewingCodesForDeal,
    isClosingCodesDialog,
    setIsClosingCodesDialog,
    isGeneratingCodes,
    setIsGeneratingCodes
  } = useSalonDealsState();
  
  const {
    handleCreateSubmit,
    handleUpdateDeal,
    handleDeleteDeal,
    handleViewDiscountCodes,
    handleGenerateDiscountCodes
  } = useDealHandlers(refetch);

  const openNewDealDialog = () => {
    setEditingDeal(null);
    setIsDialogOpen(true);
  };

  const closeDealDialog = () => {
    setIsDialogOpen(false);
    setEditingDeal(null);
  };

  const openCodesDialog = (deal: Deal) => {
    setViewingCodesForDeal(deal);
  };

  const closeCodesDialog = () => {
    setViewingCodesForDeal(null);
    setIsClosingCodesDialog(false);
  };

  const onEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setIsDialogOpen(true);
  };

  const onDelete = async (deal: Deal) => {
    await handleDeleteDeal(deal);
  };

  const onViewDiscountCodes = async (deal: Deal) => {
    openCodesDialog(deal);
    await handleViewDiscountCodes(deal);
  };

  const onGenerateDiscountCodes = async (deal: Deal, quantity: number) => {
    await handleGenerateDiscountCodes(deal, quantity);
  };

  useEffect(() => {
    refetch?.();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Dina erbjudanden</h1>
        <Button 
          onClick={openNewDealDialog}
          className="text-xs sm:text-sm flex gap-1.5"
          size="sm"
        >
          <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Nytt erbjudande</span>
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : deals.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Du har inte skapat några erbjudanden än</p>
            <Button onClick={openNewDealDialog} className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" /> 
              Skapa ditt första erbjudande
            </Button>
          </CardContent>
        </Card>
      ) : (
        <SalonDealsContent
          deals={deals}
          isLoading={isLoading}
          error={error ? String(error) : null}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDiscountCodes={onViewDiscountCodes}
          onGenerateDiscountCodes={onGenerateDiscountCodes}
          isGeneratingCodes={isGeneratingCodes}
        />
      )}

      <SalonDealsDialogs
        editingDeal={editingDeal}
        isDialogOpen={isDialogOpen}
        onCloseDealDialog={closeDealDialog}
        onUpdateDeal={handleUpdateDeal}
        onCreateDeal={handleCreateSubmit}
        isCodesDialogOpen={!!viewingCodesForDeal && !isClosingCodesDialog}
        viewingCodesFor={viewingCodesForDeal}
        onCloseCodesDialog={closeCodesDialog}
        onGenerateDiscountCodes={onGenerateDiscountCodes}
        isGeneratingCodes={isGeneratingCodes}
      />
    </div>
  );
};
