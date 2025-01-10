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
      if (!session?.user?.id) {
        throw new Error("Du måste vara inloggad för att hantera erbjudanden");
      }

      // Först hämta salongen kopplad till användaren
      const { data: salon } = await supabase
        .from('salons')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!salon) {
        throw new Error("Ingen salong hittades kopplad till ditt konto");
      }

      // Hämta erbjudanden för den specifika salongen
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('salon_id', salon.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      console.error("Error:", error);
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
      console.error("Error:", error);
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