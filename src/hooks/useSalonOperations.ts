
import { toast } from "sonner";
import { useCallback } from "react";
import { 
  fetchSalonsData, 
  checkSalonHasDeals, 
  deleteSalonData, 
  createSalonData, 
  updateSalonData 
} from "@/utils/salonAdminUtils";

export const useSalonOperations = (fetchSalons: () => Promise<void>) => {
  const handleDelete = useCallback(async (id: number) => {
    try {
      const hasDeals = await checkSalonHasDeals(id);
      if (hasDeals) {
        toast.error("Kan inte ta bort salongen eftersom den har aktiva erbjudanden");
        return false;
      }

      await deleteSalonData(id);
      toast.success("Salongen har tagits bort");
      await fetchSalons();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kunde inte ta bort salongen";
      toast.error(errorMessage);
      return false;
    }
  }, [fetchSalons]);

  const handleCreate = useCallback(async (values: any) => {
    try {
      console.log("Handling create salon with values:", values);
      const response = await createSalonData(values);
      toast.success("Salongen har skapats");
      await fetchSalons();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kunde inte skapa salongen";
      toast.error(errorMessage);
      return false;
    }
  }, [fetchSalons]);

  const handleUpdate = useCallback(async (values: any, id: number) => {
    try {
      await updateSalonData(values, id);
      toast.success("Salongen har uppdaterats");
      await fetchSalons();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kunde inte uppdatera salongen";
      toast.error(errorMessage);
      return false;
    }
  }, [fetchSalons]);

  return {
    handleDelete,
    handleCreate,
    handleUpdate
  };
};
