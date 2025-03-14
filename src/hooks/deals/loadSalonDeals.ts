
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { fetchSalonDeals } from "@/utils/dealApiUtils";

export const loadSalonDeals = async (
  salonId: string | undefined,
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isLoadingDeals: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>,
  loadAttempts: React.MutableRefObject<number>
): Promise<void> => {
  // Förhindra dubbla anrop och kontrollera att komponenten fortfarande är monterad
  if (isLoadingDeals.current || !isMountedRef.current || !salonId) {
    console.log("Skipping loadSalonDeals: already loading, unmounted, or no salonId");
    return;
  }
  
  // Begränsa antalet laddningsförsök för att undvika potentiella oändliga loopar
  if (loadAttempts.current > 3) {
    console.log("Too many load attempts, skipping");
    return;
  }
  
  loadAttempts.current++;
  
  try {
    console.log(`Loading salon deals for salon ID: ${salonId}, attempt: ${loadAttempts.current}`);
    isLoadingDeals.current = true;
    setIsLoading(true);
    setError(null);
    
    const fetchedDeals = await fetchSalonDeals(salonId);
    
    if (isMountedRef.current) {
      console.log(`Successfully loaded ${fetchedDeals.length} deals for salon ${salonId}`);
      setDeals(fetchedDeals);
      // Återställ försöksräknaren vid framgång
      loadAttempts.current = 0;
    }
  } catch (err: any) {
    console.error("Error fetching salon deals:", err);
    if (isMountedRef.current) {
      setError(err.message || "Ett fel uppstod");
      toast.error("Ett fel uppstod när erbjudanden skulle hämtas");
    }
  } finally {
    isLoadingDeals.current = false;
    if (isMountedRef.current) {
      setIsLoading(false);
    }
  }
};
