import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { Deal } from "@/components/admin/types";
import { DealFormValues } from "@/types/deal-form";
import { 
  fetchSalonIdForUser, 
  createDealInDb, 
  updateDealInDb, 
  deleteDealFromDb 
} from "@/utils/dealAdminUtils";

export const useDealsAdmin = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading, error } = useQuery<Deal[]>({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteDealFromDb(id);
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success("Erbjudandet har tagits bort");
      return true;
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Kunde inte ta bort erbjudandet");
      return false;
    }
  };

  const handleUpdate = async (values: DealFormValues, id: number) => {
    try {
      await updateDealInDb(values, id);
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success("Erbjudandet har uppdaterats");
      return true;
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Kunde inte uppdatera erbjudandet");
      return false;
    }
  };

  const handleCreate = async (values: DealFormValues) => {
    try {
      if (!session?.user?.id) {
        toast.error("Du måste vara inloggad för att skapa erbjudanden");
        return false;
      }

      const salon = await fetchSalonIdForUser(session.user.id);
      if (!salon) {
        toast.error("Ingen salong hittades kopplad till ditt konto");
        return false;
      }

      await createDealInDb(values, salon.id);
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success("Erbjudandet har skapats");
      return true;
    } catch (error: any) {
      console.error("Create error:", error);
      toast.error(error.message || "Kunde inte skapa erbjudandet");
      return false;
    }
  };

  return {
    deals,
    isLoading,
    error,
    handleDelete,
    handleUpdate,
    handleCreate,
  };
};