
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { fetchSalonByExactId, resolveSalonData } from "@/utils/salon";

/**
 * Hook för att hämta adressinformation för en salong baserad på salonId
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
        console.log(`[useMapAddress] Hämtar adress för salong med ID: ${salonId} (typ: ${typeof salonId})`);
        
        if (!salonId) {
          console.log("[useMapAddress] Inget salong-ID angivet");
          setIsLoading(false);
          return;
        }
        
        // Strategi 1: Direkthämtning (anpassad för publik åtkomst)
        console.log("[useMapAddress] Försöker hämta salongsdata med direkthämtning");
        let salonData = await fetchSalonByExactId(salonId);
        
        // Strategi 2: Om direkthämtning misslyckas, använd resolveSalonData
        if (!salonData) {
          console.log("[useMapAddress] Direkthämtning misslyckades, försöker med resolveSalonData");
          salonData = await resolveSalonData(salonId);
        }

        if (salonData) {
          console.log("[useMapAddress] Salongsdata hämtad:", salonData);
          setAddress(salonData.address || null);
          setSalonName(salonData.name || null);
          setSalonPhone(salonData.phone || null);
        } else {
          console.log("[useMapAddress] Kunde inte hitta någon salongsdata");
          setError("Kunde inte hitta salongsinformation");
        }
      } catch (err) {
        console.error("[useMapAddress] Fel vid hämtning:", err);
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
