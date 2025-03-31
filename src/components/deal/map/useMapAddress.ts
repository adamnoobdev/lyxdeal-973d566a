
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
        
        // Strategi 1: Försök hämta data direkt med fetchSalonByExactId
        // Vi skickar in salonId som det är eftersom funktionen hanterar både string och number
        console.log("[useMapAddress] Försöker hämta salongsdata med direkthämtning");
        let salonData = await fetchSalonByExactId(salonId);
        
        // Strategi 2: Om direkthämtning misslyckas, använd resolveSalonData för en mer robust sökning
        if (!salonData) {
          console.log("[useMapAddress] Direkthämtning misslyckades, försöker med resolveSalonData");
          // Konvertera till number om det är en string
          const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
          // Kontrollera om vi fick ett giltigt nummer
          if (typeof numericId === 'number' && !isNaN(numericId)) {
            salonData = await resolveSalonData(numericId);
          } else {
            console.log("[useMapAddress] Kunde inte konvertera salonId till ett giltigt nummer");
            setError("Ogiltigt salong-ID format");
            setIsLoading(false);
            return;
          }
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
