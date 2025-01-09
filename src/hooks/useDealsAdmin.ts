import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Deal } from "@/components/admin/types";

export const useDealsAdmin = () => {
  const queryClient = useQueryClient();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Kunde inte hämta erbjudanden");
        throw error;
      }

      return data.map((deal) => ({
        id: deal.id,
        title: deal.title,
        description: deal.description,
        originalPrice: deal.original_price,
        discountedPrice: deal.discounted_price,
        category: deal.category,
        city: deal.city,
        timeRemaining: deal.time_remaining,
        imageUrl: deal.image_url,
        featured: deal.featured,
        created_at: deal.created_at,
        updated_at: deal.updated_at
      })) as Deal[];
    },
  });

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success("Erbjudandet har tagits bort");
      return true;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Kunde inte ta bort erbjudandet");
      return false;
    }
  };

  const handleUpdate = async (values: any, id: number) => {
    try {
      const { error } = await supabase
        .from("deals")
        .update({
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: parseInt(values.originalPrice),
          discounted_price: parseInt(values.discountedPrice),
          category: values.category,
          city: values.city,
          time_remaining: values.timeRemaining,
          featured: values.featured,
        })
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success("Erbjudandet har uppdaterats");
      return true;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Kunde inte uppdatera erbjudandet");
      return false;
    }
  };

  return {
    deals,
    isLoading,
    error,
    handleDelete,
    handleUpdate,
  };
};