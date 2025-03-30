
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveSalonData } from "@/utils/salon/salonDataUtils";
import { formatDealData, type RawDealData } from "@/utils/deal/dealDataUtils";
import { handleDealError } from "@/utils/deal/dealErrorHandler";
import { toast } from "sonner";

export const useDeal = (id: string | undefined) => {
  return useQuery({
    queryKey: ["deal", id],
    queryFn: async () => {
      try {
        if (!id) {
          console.error("[useDeal] Inget erbjudande-ID tillhandahållet");
          throw new Error("Inget erbjudande-ID tillhandahållet");
        }
        
        const dealId = parseInt(id);
        if (isNaN(dealId)) {
          console.error("[useDeal] Ogiltigt erbjudande-ID:", id);
          throw new Error("Ogiltigt erbjudande-ID");
        }

        console.log("[useDeal] Hämtar erbjudande med ID:", dealId);

        // Hämta erbjudandedata med förbättrad felhantering
        const { data: dealData, error: dealError, status } = await supabase
          .from("deals")
          .select("*")
          .eq("id", dealId)
          .single();
        
        console.log("[useDeal] Erbjudandeförfrågans status:", status);

        if (dealError) {
          console.error("[useDeal] Fel vid hämtning av erbjudande:", dealError);
          throw dealError;
        }
        
        if (!dealData) {
          console.error("[useDeal] Erbjudande hittades inte med ID:", dealId);
          throw new Error("Erbjudande hittades inte");
        }

        console.log("[useDeal] Råa erbjudandedata från DB:", dealData);
        
        // Förbättrad salongsdata-hämtning som prioriterar direkta API-anrop
        console.log("[useDeal] Försöker hämta salongsdata för ID:", dealData.salon_id);
        
        // Använd den förbättrade resolveSalonData som prioriterar direkta anrop
        const salonData = await resolveSalonData(dealData.salon_id, dealData.city);
        console.log("[useDeal] Resultat av salongsupplösning:", salonData);
        
        // Format and return the complete deal data
        return formatDealData(dealData as RawDealData, salonData);
      } catch (error) {
        handleDealError(error);
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minut caching
    refetchOnWindowFocus: true, 
    refetchOnMount: 'always',
    retry: 3,
  });
};
