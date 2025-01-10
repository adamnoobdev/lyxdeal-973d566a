import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Deal } from "@/components/admin/types";
import { useSession } from "./useSession";

export const useDealsAdmin = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("Du måste vara inloggad för att hantera erbjudanden");
      }

      // First check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (roleError) {
        console.error("Role check error:", roleError);
        throw new Error("Kunde inte verifiera admin-behörighet");
      }

      if (!roleData) {
        throw new Error("Du har inte behörighet att hantera erbjudanden");
      }

      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Deals fetch error:", error);
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
    retry: false,
  });

  const handleDelete = async (id: number) => {
    try {
      if (!session?.user?.id) {
        toast.error("Du måste vara inloggad för att ta bort erbjudanden");
        return false;
      }

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
      if (!session?.user?.id) {
        toast.error("Du måste vara inloggad för att uppdatera erbjudanden");
        return false;
      }

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