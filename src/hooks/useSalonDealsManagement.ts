
import { useState, useEffect } from "react";
import { Deal } from "@/components/admin/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { endOfMonth } from "date-fns";

export const useSalonDealsManagement = (salonId: string | undefined) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    if (salonId) {
      fetchSalonDeals();
    }
  }, [salonId]);

  const fetchSalonDeals = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!salonId) {
        throw new Error("No salon ID provided");
      }

      const salonIdNumber = parseInt(salonId);
      if (isNaN(salonIdNumber)) {
        throw new Error("Invalid salon ID");
      }

      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("salon_id", salonIdNumber)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to include required properties
      const typedDeals = (data || []).map(deal => {
        // Default expiration_date to current date if not present
        const defaultExpirationDate = new Date().toISOString();
        
        return {
          ...deal,
          status: deal.status as 'pending' | 'approved' | 'rejected',
          is_free: deal.is_free || false,
          expiration_date: deal.expiration_date || defaultExpirationDate
        };
      }) as Deal[];

      setDeals(typedDeals);
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
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", deletingDeal.id);

      if (error) throw error;

      toast.success("Erbjudandet har tagits bort");
      await fetchSalonDeals();
      setDeletingDeal(null);
    } catch (err: any) {
      console.error("Error deleting deal:", err);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingDeal) return;

    try {
      const originalPrice = parseInt(values.originalPrice) || 0;
      const discountedPrice = values.is_free ? 0 : parseInt(values.discountedPrice) || 0;
      
      console.log('Updating salon deal with values:', {
        ...values,
        originalPrice,
        discountedPrice,
        is_free: values.is_free
      });
      
      const { error } = await supabase
        .from("deals")
        .update({
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: originalPrice,
          discounted_price: discountedPrice,
          category: values.category,
          city: values.city,
          featured: values.featured,
          is_free: values.is_free || false,
          quantity_left: parseInt(values.quantity) || 10,
          status: 'pending',
          expiration_date: values.expirationDate.toISOString()
        })
        .eq("id", editingDeal.id);

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }

      toast.success("Erbjudandet har uppdaterats");
      await fetchSalonDeals();
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
