
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

        // Direkt försök att hämta salongsdata först
        let salonData = null;
        if (dealData.salon_id) {
          const { data: directSalonData, error: salonError } = await supabase
            .from("salons")
            .select("id, name, address, phone")
            .eq("id", dealData.salon_id)
            .single();
            
          if (!salonError && directSalonData) {
            console.log("Successfully fetched salon data directly:", directSalonData);
            salonData = directSalonData;
          } else {
            console.log("Could not fetch salon data directly, trying with resolver:", salonError);
          }
        }
        
        // Fallback till resolver om direkt hämtning misslyckas
        if (!salonData) {
          try {
            salonData = await resolveSalonData(dealData.salon_id, dealData.city);
            console.log("Resolved salon data using resolver:", salonData);
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
