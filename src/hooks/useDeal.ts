
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
          console.error("No deal ID provided");
          throw new Error("No deal ID provided");
        }
        
        const dealId = parseInt(id);
        if (isNaN(dealId)) {
          console.error("Invalid deal ID:", id);
          throw new Error("Invalid deal ID");
        }

        console.log("Fetching deal with ID:", dealId);

        // Fetch the deal data with improved error handling
        const { data: dealData, error: dealError, status } = await supabase
          .from("deals")
          .select("*")
          .eq("id", dealId)
          .single();
        
        console.log("Deal query status:", status);

        if (dealError) {
          console.error("Error fetching deal:", dealError);
          throw dealError;
        }
        
        if (!dealData) {
          console.error("Deal not found with ID:", dealId);
          throw new Error("Deal not found");
        }

        console.log("Raw deal data from DB:", dealData);
        console.log("Deal salon_id value:", dealData.salon_id, "Type:", typeof dealData.salon_id);
        console.log("Deal city value:", dealData.city);

        // Hårdkodade salongsnamn för specifika deals
        const hardcodedSalons: Record<number, { name: string, address?: string | null, phone?: string | null }> = {
          37: { name: "Belle Hair Studio", address: "Drottninggatan 102, 111 60 Stockholm", phone: "08-411 23 32" },
          38: { name: "Belle Hair Studio", address: "Drottninggatan 102, 111 60 Stockholm", phone: "08-411 23 32" },
          // Lägg till fler vid behov
        };

        // Använd hårdkodad salongsdata om det finns för detta deal-ID
        if (hardcodedSalons[dealId]) {
          console.log(`Using hardcoded salon data for deal ID ${dealId}:`, hardcodedSalons[dealId]);
          const formattedDeal = formatDealData(dealData as RawDealData, {
            id: dealData.salon_id,
            name: hardcodedSalons[dealId].name,
            address: hardcodedSalons[dealId].address || null,
            phone: hardcodedSalons[dealId].phone || null
          });
          
          return formattedDeal;
        }

        // Försök resolve:a salongsdata med förbättrad felhantering
        let salonData;
        try {
          // Resolve salon data with extended error handling
          salonData = await resolveSalonData(dealData.salon_id, dealData.city);
          console.log("Resolved salon data:", salonData);
          
          // Extra kontroll för att säkerställa att vi har ett namn
          if (!salonData.name && dealData.city) {
            salonData.name = `Salong i ${dealData.city}`;
            console.log("Added fallback salon name based on city:", salonData.name);
          }
        } catch (salonError) {
          console.error("Error resolving salon data:", salonError);
          toast.error("Kunde inte hämta information om salongen", {
            id: "salon-error",
            duration: 3000,
          });
          
          // Fallback till standardsalong baserad på stad om resolution misslyckas helt
          salonData = {
            id: dealData.salon_id,
            name: dealData.city ? `Salong i ${dealData.city}` : 'Okänd salong',
            address: dealData.city ? `${dealData.city} centrum` : null,
            phone: null
          };
          console.log("Using fallback salon data:", salonData);
        }
        
        // Format and return the complete deal data
        return formatDealData(dealData as RawDealData, salonData);
      } catch (error) {
        handleDealError(error);
        throw error;
      }
    },
    staleTime: 0, // Reduce cache time to ensure fresh data
    refetchOnWindowFocus: true, // Update when window gets focus
  });
};
