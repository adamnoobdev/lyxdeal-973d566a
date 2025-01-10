import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Deal } from "@/components/admin/types";
import { useSession } from "./useSession";
import { checkAdminRole, fetchDeals } from "@/utils/adminUtils";
import { deleteDeal, updateDeal } from "@/utils/dealMutations";

export const useDealsAdmin = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("Du måste vara inloggad för att hantera erbjudanden");
      }

      await checkAdminRole(session.user.id);
      return fetchDeals();
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

      await updateDeal(values, id);
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