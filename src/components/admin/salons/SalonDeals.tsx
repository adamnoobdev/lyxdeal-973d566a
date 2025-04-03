
import React from 'react';
import { useSalonDealsManager } from "./deals/useSalonDealsManager";
import { SalonDealsContent } from "./deals/SalonDealsContent";
import { SalonDealsDialogs } from "./deals/SalonDealsDialogs";

export function SalonDeals() {
  const {
    deals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error,
    editingDeal,
    deletingDeal,
    viewingCodesForDeal,
    isClosingCodesDialog,
    isDiscountCodesDialogOpen,
    isSubmitting,
    initialValues,
    handleEdit,
    handleDeleteClick,
    handleClose,
    handleCloseDelete,
    handleViewDiscountCodes,
    handleCloseDiscountCodesDialog,
    handleUpdateSubmit,
    handleDeleteDeal,
    handleToggleActive
  } = useSalonDealsManager();

  return (
    <>
      <SalonDealsContent
        deals={deals}
        activeDeals={activeDeals}
        inactiveDeals={inactiveDeals}
        isLoading={isLoading}
        error={error}
        handleEdit={handleEdit}
        handleDeleteClick={handleDeleteClick}
        handleToggleActive={handleToggleActive}
        handleViewDiscountCodes={handleViewDiscountCodes}
      />

      <SalonDealsDialogs
        editingDeal={editingDeal}
        deletingDeal={deletingDeal}
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        isDiscountCodesDialogOpen={isDiscountCodesDialogOpen}
        viewingCodesForDeal={viewingCodesForDeal}
        handleClose={handleClose}
        handleCloseDelete={handleCloseDelete}
        handleCloseDiscountCodesDialog={handleCloseDiscountCodesDialog}
        handleUpdateSubmit={handleUpdateSubmit}
        handleDeleteDeal={handleDeleteDeal}
      />
    </>
  );
}
