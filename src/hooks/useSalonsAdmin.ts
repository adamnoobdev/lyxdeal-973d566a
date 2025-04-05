
import { useState, useCallback } from "react";
import { Salon } from "@/components/admin/types";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import { fetchSalonsData } from "@/utils/salonAdminUtils";
import { useSalonOperations } from "@/hooks/useSalonOperations";
import { SalonData } from "@/utils/salon/types";

/**
 * Hook för att hantera salongsadministration
 * @returns Funktionalitet för att hantera salonger
 */
export const useSalonsAdmin = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session, isLoading: sessionLoading } = useSession();

  /**
   * Hämtar alla salonger från databasen
   */
  const fetchSalons = useCallback(async () => {
    if (sessionLoading) return;
    
    if (!session?.user) {
      setError("Du måste vara inloggad för att se salonger");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Försöker hämta salonger med fetchSalonsData()");
      setIsLoading(true);
      setError(null);
      
      const data = await fetchSalonsData();
      
      // Transform the data to match the Salon type
      if (data) {
        const transformedData: Salon[] = data.map(salon => ({
          id: salon.id || 0,
          name: salon.name,
          email: 'email' in salon ? salon.email : '',
          phone: salon.phone || null,
          address: salon.address || null,
          created_at: 'created_at' in salon ? salon.created_at : new Date().toISOString(),
          user_id: 'user_id' in salon ? salon.user_id : null,
          role: 'role' in salon ? salon.role : 'salon_owner',
          terms_accepted: 'terms_accepted' in salon ? salon.terms_accepted : true,
          privacy_accepted: 'privacy_accepted' in salon ? salon.privacy_accepted : true,
          rating: 'rating' in salon ? salon.rating : null,
          rating_comment: 'rating_comment' in salon ? salon.rating_comment : null
        }));
        
        setSalons(transformedData);
      } else {
        setSalons([]);
      }
      
      console.log("Hämtade salonger:", data?.length || 0);
    } catch (err) {
      console.error("Error fetching salons:", err);
      const errorMessage = err instanceof Error ? err.message : "Ett fel uppstod vid hämtning av salonger";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, sessionLoading]);

  // Använd operationshook för att hantera CRUD-operationer
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
