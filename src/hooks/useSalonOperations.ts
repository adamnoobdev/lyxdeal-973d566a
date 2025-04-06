
import { toast } from "sonner";
import { useCallback } from "react";
import { 
  checkSalonHasDeals, 
  deleteSalonData, 
  createSalonData, 
  updateSalonData 
} from "@/utils/salon/admin";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook för att hantera salongsoperationer (skapa, uppdatera, ta bort)
 * @param fetchSalons Funktion för att uppdatera salongslistan
 * @returns Funktioner för att hantera salonger
 */
export const useSalonOperations = (fetchSalons: () => Promise<void>) => {
  /**
   * Ta bort en salong
   * @param id Salongens ID
   * @returns True om borttagningen lyckades, annars false
   */
  const handleDelete = useCallback(async (id: number) => {
    try {
      const hasDeals = await checkSalonHasDeals(id);
      if (hasDeals) {
        toast.error("Kan inte ta bort salongen eftersom den har aktiva erbjudanden");
        return false;
      }

      // Hämta salongen för att kontrollera om den har en user_id koppling
      const { data: salon } = await supabase
        .from("salons")
        .select("user_id")
        .eq("id", id)
        .single();

      // Ta bort salon_user_status om det finns en user_id
      if (salon?.user_id) {
        const { error: statusError } = await supabase
          .from('salon_user_status')
          .delete()
          .eq('user_id', salon.user_id);
          
        if (statusError) {
          console.error("Kunde inte ta bort salon_user_status:", statusError);
          // Fortsätt ändå med borttagningen av salongen
        }
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

  /**
   * Skapa en ny salong
   * @param values Salongdata
   * @returns Resultat från API:et eller false vid fel
   */
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

  /**
   * Uppdatera en existerande salong
   * @param values Nya värden
   * @param id Salongens ID
   * @returns True om uppdateringen lyckades, annars false
   */
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
