
import { useState, useCallback } from "react";
import { Salon } from "@/components/admin/types";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import { fetchSalonsData } from "@/utils/salon/admin/fetchSalons";
import { useSalonOperations } from "@/hooks/useSalonOperations";

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
        const transformedData: Salon[] = data.map(salon => {
          // Log the raw rating value from database
          console.log(`Salon ${salon.name} raw rating:`, salon.rating);
          
          // Ensure we have a valid number for rating before division
          let ratingValue: number | null = null;
          
          if (salon.rating != null && typeof salon.rating === 'number') {
            // Convert from integer (stored as 47) to decimal (4.7)
            ratingValue = Math.round(Number(salon.rating) / 10 * 10) / 10;
            console.log(`Salon ${salon.name} converted rating:`, ratingValue);
          }
          
          return {
            id: Number(salon.id) || 0,
            name: String(salon.name || ''),
            email: typeof salon.email === 'string' ? salon.email : '',
            phone: salon.phone !== null ? String(salon.phone) : null,
            address: salon.address !== null ? String(salon.address) : null,
            created_at: typeof salon.created_at === 'string' ? salon.created_at : new Date().toISOString(),
            user_id: typeof salon.user_id === 'string' ? salon.user_id : null,
            role: typeof salon.role === 'string' ? salon.role : 'salon_owner',
            terms_accepted: typeof salon.terms_accepted === 'boolean' ? salon.terms_accepted : true,
            privacy_accepted: typeof salon.privacy_accepted === 'boolean' ? salon.privacy_accepted : true,
            rating: ratingValue,
            rating_comment: salon.rating_comment !== null ? String(salon.rating_comment) : null,
            subscription_plan: salon.subscription_plan || null,
            subscription_type: salon.subscription_type || null,
            skip_subscription: Boolean(salon.skip_subscription)
          };
        });
        
        setSalons(transformedData);
        console.log("Salon data transformation complete. Found", transformedData.length, "salons");
      } else {
        setSalons([]);
        console.log("No salon data returned from fetchSalonsData");
      }
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
