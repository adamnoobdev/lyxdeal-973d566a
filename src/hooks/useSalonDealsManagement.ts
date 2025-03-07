
import { useState, useEffect } from "react";
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { fetchSalonDeals, deleteSalonDeal, updateSalonDeal, DealUpdateValues } from "@/utils/dealApiUtils";

export const useSalonDealsManagement = (salonId: string | undefined) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    if (salonId) {
      loadSalonDeals();
    }
  }, [salonId]);

  const loadSalonDeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedDeals = await fetchSalonDeals(salonId);
      setDeals(fetchedDeals);
    } catch (err: any) {
      console.error("Error fetching salon deals:", err);
      setError(err.message);
      toast.error("Ett fel uppstod när erbjudanden skulle hämtas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingDeal) return;

    try {
      await deleteSalonDeal(deletingDeal.id);
      toast.success("Erbjudandet har tagits bort");
      await loadSalonDeals();
      setDeletingDeal(null);
    } catch (err: any) {
      console.error("Error deleting deal:", err);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingDeal) return;

    try {
      const updateValues: DealUpdateValues = {
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl,
        originalPrice: parseInt(values.originalPrice) || 0,
        discountedPrice: values.is_free ? 0 : parseInt(values.discountedPrice) || 0,
        category: values.category,
        city: values.city,
        featured: values.featured,
        is_free: values.is_free || false,
        quantity: parseInt(values.quantity) || 10,
        expirationDate: values.expirationDate,
        salon_id: editingDeal.salon_id
      };
      
      await updateSalonDeal(editingDeal.id, updateValues);
      toast.success("Erbjudandet har uppdaterats");
      await loadSalonDeals();
      setEditingDeal(null);
    } catch (err: any) {
      console.error("Error updating deal:", err);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    }
  };

  return {
    deals,
    isLoading,
    error,
    editingDeal,
    deletingDeal,
    setEditingDeal,
    setDeletingDeal,
    handleDelete,
    handleUpdate,
  };
};
