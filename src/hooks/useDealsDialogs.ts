
import { useState, useRef, useCallback } from "react";
import { Deal } from "@/components/admin/types";

export const useDealsDialogs = () => {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const isUpdatingDealRef = useRef(false);
  const isDeletingDealRef = useRef(false);
  
  const handleEditDeal = useCallback((deal: Deal) => {
    setEditingDeal(deal);
  }, []);
  
  const handleDeleteDeal = useCallback((deal: Deal) => {
    setDeletingDeal(deal);
  }, []);
  
  const handleCreateDeal = useCallback(() => {
    setIsCreating(true);
  }, []);
  
  const handleCloseDialogs = useCallback(() => {
    setEditingDeal(null);
    setDeletingDeal(null);
    setIsCreating(false);
  }, []);
  
  return {
    editingDeal,
    deletingDeal,
    isCreating,
    isUpdatingDealRef,
    isDeletingDealRef,
    handleEditDeal,
    handleDeleteDeal,
    handleCreateDeal,
    handleCloseDialogs,
  };
};
