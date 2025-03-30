
import { useState, useCallback } from "react";
import { Salon } from "@/components/admin/types";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import { fetchSalonsData } from "@/utils/salonAdminUtils";
import { useSalonOperations } from "@/hooks/useSalonOperations";

export const useSalonsAdmin = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session, isLoading: sessionLoading } = useSession();

  const fetchSalons = useCallback(async () => {
    if (sessionLoading) return;
    
    if (!session?.user) {
      setError("Du måste vara inloggad för att se salonger");
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchSalonsData();
      setSalons(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ett fel uppstod vid hämtning av salonger";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, sessionLoading]);

  // Use the salon operations hook
  const { handleDelete, handleCreate, handleUpdate } = useSalonOperations(fetchSalons);

  return {
    salons,
    isLoading: isLoading || sessionLoading,
    error,
    fetchSalons,
    handleDelete,
    handleCreate,
    handleUpdate,
  };
};
