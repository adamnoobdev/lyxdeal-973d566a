
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { fetchSalonByExactId, resolveSalonData } from "@/utils/salon";

/**
 * Hook to fetch address information for a salon based on salonId
 */
export const useMapAddress = (salonId?: number | string | null) => {
  const [address, setAddress] = useState<string | null>(null);
  const [salonName, setSalonName] = useState<string | null>(null);
  const [salonPhone, setSalonPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`[useMapAddress] Fetching address for salon ID: ${salonId} (type: ${typeof salonId})`);
        
        if (!salonId) {
          console.log("[useMapAddress] No salon ID provided");
          setIsLoading(false);
          return;
        }
        
        // Always try to fetch salon data without authentication first using directFetch
        console.log("[useMapAddress] Trying to fetch salon data without authentication");
        let salonData = await fetchSalonByExactId(salonId);
        console.log("[useMapAddress] Direct fetch result:", salonData);

        // If that fails and we have a session, try with authentication as backup
        if (!salonData && session) {
          console.log("[useMapAddress] Attempting authenticated fetch for salon data");
          salonData = await resolveSalonData(salonId);
          console.log("[useMapAddress] Authenticated fetch result:", salonData);
        }
        
        // If we still don't have data, try resolving without session as fallback
        if (!salonData) {
          console.log("[useMapAddress] Attempting fallback resolution without session");
          salonData = await resolveSalonData(salonId);
          console.log("[useMapAddress] Fallback resolution result:", salonData);
        }

        if (salonData) {
          console.log("[useMapAddress] Salon data fetched successfully:", salonData);
          setAddress(salonData.address || null);
          setSalonName(salonData.name || null);
          setSalonPhone(salonData.phone || null);
        } else {
          console.log("[useMapAddress] No salon data found");
          setError("Kunde inte hitta salongsinformation");
        }
      } catch (err) {
        console.error("[useMapAddress] Error fetching address:", err);
        setError(`Ett fel uppstod: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (salonId) {
      fetchData();
    } else {
      setAddress(null);
      setSalonName(null);
      setSalonPhone(null);
      setIsLoading(false);
    }
  }, [salonId, session]);

  return {
    address,
    salonName,
    salonPhone,
    isLoading,
    error
  };
};
