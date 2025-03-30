
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveSalonData } from "@/utils/salon/salonDataUtils";
import { formatDealData, type RawDealData } from "@/utils/deal/dealDataUtils";
import { handleDealError } from "@/utils/deal/dealErrorHandler";

export const useDeal = (id: string | undefined) => {
  return useQuery({
    queryKey: ["deal", id],
    queryFn: async () => {
      try {
        if (!id) {
          throw new Error("No deal ID provided");
        }
        
        const dealId = parseInt(id);
        if (isNaN(dealId)) {
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
          throw new Error("Deal not found");
        }

        console.log("Raw deal data from DB:", dealData);
        console.log("Deal salon_id value:", dealData.salon_id, "Type:", typeof dealData.salon_id);

        // Always provide a default salon data in case the resolution fails
        let salonData;
        try {
          // Resolve salon data with extended error handling
          salonData = await resolveSalonData(dealData.salon_id, dealData.city);
        } catch (salonError) {
          console.error("Error resolving salon data:", salonError);
          // Fallback to a default salon based on city if salon resolution fails completely
          salonData = {
            id: null,
            name: dealData.city ? `Salong i ${dealData.city}` : 'Okänd salong',
            address: dealData.city || null,
            phone: null
          };
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
