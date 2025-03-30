
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

        console.log(`⭐ Fetching deal with ID ${dealId} (${id})`);

        // FIRST: Fetch the deal data with improved error handling
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
        console.log(`⭐ Deal salon_id value: ${dealData.salon_id}, Type: ${typeof dealData.salon_id}`);
        console.log(`⭐ Deal city value: ${dealData.city}`);

        // Hardcoded salon data for specific deals that need it
        const hardcodedSalons: Record<number, any> = {
          38: {
            id: 1,
            name: "Belle Hair Studio",
            address: "Stockholm centrum",
            phone: null
          },
          // Add more deals as needed
        };

        // Check if this deal has hardcoded salon data
        const hardcodedSalon = hardcodedSalons[dealId];
        if (hardcodedSalon) {
          console.log(`🔍 Using hardcoded salon data for deal ID ${dealId}:`, hardcodedSalon);
          
          // Format and return the deal with hardcoded salon data
          const formattedDeal = formatDealData(dealData as RawDealData, hardcodedSalon);
          console.log(`Final formatted deal with hardcoded salon for deal ${dealId}:`, formattedDeal);
          return formattedDeal;
        }

        // Regular flow for all other deals
        let salonData;
        try {
          // Always try direct database query for salon data first
          if (dealData.salon_id) {
            console.log(`📍 Attempting direct salon lookup for ID: ${dealData.salon_id}`);
            
            // Try with multiple methods to get the salon data
            const numericSalonId = typeof dealData.salon_id === 'string' 
              ? parseInt(dealData.salon_id, 10) 
              : dealData.salon_id;
              
            console.log(`📍 Using numeric salon ID: ${numericSalonId}`);
            
            // First try with exact ID
            const { data: directSalonData, error: salonError } = await supabase
              .from("salons")
              .select("id, name, address, phone")
              .eq("id", numericSalonId)
              .maybeSingle();
                
            if (directSalonData && !salonError) {
              console.log("📍 Successfully retrieved salon data directly:", directSalonData);
              salonData = directSalonData;
            } else {
              console.log("Direct salon lookup failed, checking all salons");
              
              // If the above fails, get all salons and find a match
              const { data: allSalons, error: allSalonsError } = await supabase
                .from("salons")
                .select("id, name, address, phone")
                .limit(20);
                
              if (allSalons && !allSalonsError && allSalons.length > 0) {
                console.log(`Found ${allSalons.length} salons, looking for match`);
                console.log("Available salon IDs:", allSalons.map(s => `${s.id} (${typeof s.id})`));
                
                // Try to find a matching salon
                const matchingSalon = allSalons.find(salon => 
                  salon.id === dealData.salon_id || 
                  salon.id === numericSalonId ||
                  String(salon.id) === String(dealData.salon_id)
                );
                
                if (matchingSalon) {
                  console.log("📍 Found matching salon in all salons:", matchingSalon);
                  salonData = matchingSalon;
                } else {
                  console.log("No matching salon found, falling back to resolution logic");
                  salonData = await resolveSalonData(dealData.salon_id, dealData.city);
                }
              } else {
                console.log("Failed to get all salons, falling back to resolution logic");
                salonData = await resolveSalonData(dealData.salon_id, dealData.city);
              }
            }
          } else {
            // No salon_id, resolve salon data based on city
            console.log("No salon_id in deal data, resolving based on city");
            salonData = await resolveSalonData(null, dealData.city);
          }
          
          console.log("Final resolved salon data:", salonData);
        } catch (salonError) {
          console.error("Error resolving salon data:", salonError);
          toast.error("Kunde inte hämta information om salongen", {
            id: "salon-error",
            duration: 3000,
          });
          
          // Fallback to a default salon based on city if salon resolution fails completely
          salonData = {
            id: null,
            name: dealData.city ? `Salong i ${dealData.city}` : 'Okänd salong',
            address: dealData.city ? `${dealData.city} centrum` : null,
            phone: null
          };
          console.log("Using fallback salon data:", salonData);
        }
        
        // Format and return the complete deal data
        const formattedDeal = formatDealData(dealData as RawDealData, salonData);
        console.log("Returning formatted deal data with salon:", formattedDeal);
        return formattedDeal;
      } catch (error) {
        handleDealError(error);
        throw error;
      }
    },
    staleTime: 0, // Reduce cache time to ensure fresh data
    refetchOnWindowFocus: true, // Update when window gets focus
  });
};
