import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Deal } from "@/components/admin/types";
import { useSession } from "./useSession";
import { deleteDeal, updateDeal } from "@/utils/dealMutations";
import { supabase } from "@/integrations/supabase/client";

export const useDealsAdmin = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      console.log("Starting to fetch deals...");
      console.log("Session:", session);

      if (!session?.user?.id) {
        console.error("No session found");
        throw new Error("Du måste vara inloggad för att hantera erbjudanden");
      }

      // Först hämta salongen kopplad till användaren
      const { data: salon, error: salonError } = await supabase
        .from('salons')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (salonError) {
        console.error("Error fetching salon:", salonError);
        throw new Error("Kunde inte hämta salonginformation");
      }

      console.log("Salon data:", salon);

      if (!salon) {
        console.error("No salon found for user");
        throw new Error("Ingen salong hittades kopplad till ditt konto");
      }

      // Hämta erbjudanden för den specifika salongen
      const { data, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('salon_id', salon.id)
        .order('created_at', { ascending: false });

      if (dealsError) {
        console.error("Error fetching deals:", dealsError);
        throw dealsError;
      }

      console.log("Fetched deals:", data);
      return data;
    },
    retry: false,
  });

  const handleDelete = async (id: number) => {
    try {
      if (!session?.user?.id) {
        toast.error("Du måste vara inloggad för att ta bort erbjudanden");
        return false;
      }

      await deleteDeal(id);
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success("Erbjudandet har tagits bort");
      return true;
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Kunde inte ta bort erbjudandet");
      return false;
    }
  };

  const handleUpdate = async (values: any, id: number) => {
    try {
      if (!session?.user?.id) {
        toast.error("Du måste vara inloggad för att uppdatera erbjudanden");
        return false;
      }

      const { data: salon } = await supabase
        .from('salons')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!salon) {
        toast.error("Ingen salong hittades kopplad till ditt konto");
        return false;
      }

      await updateDeal({ ...values, salon_id: salon.id }, id);
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success("Erbjudandet har uppdaterats");
      return true;
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Kunde inte uppdatera erbjudandet");
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