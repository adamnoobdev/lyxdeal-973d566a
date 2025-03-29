
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

        // Fetch the deal data first
        const { data: dealData, error: dealError } = await supabase
          .from("deals")
          .select("*")
          .eq("id", dealId)
          .single();

        if (dealError) {
          console.error("Error fetching deal:", dealError);
          throw dealError;
        }
        
        if (!dealData) {
          throw new Error("Deal not found");
        }

        console.log("Raw deal data from DB:", dealData);

        // Initialize salon data with default values
        let salonData = {
          id: dealData.salon_id || null,
          name: dealData.city ? `Salong i ${dealData.city}` : 'Okänd salong',
          address: dealData.city || null,
          phone: null
        };

        // Only attempt to fetch salon data if we have a salon_id
        if (dealData.salon_id) {
          console.log(`Attempting to fetch salon data for salon_id: ${dealData.salon_id}`);
          
          try {
            // Separate try/catch to handle salon fetch errors independently
            const { data: fetchedSalonData, error: salonError } = await supabase
              .from("salons")
              .select("id, name, address, phone")
              .eq("id", dealData.salon_id)
              .maybeSingle();
              
            if (salonError) {
              console.error(`Error fetching salon data for salon_id ${dealData.salon_id}:`, salonError.message);
              console.error("Full error object:", salonError);
            } else if (fetchedSalonData) {
              console.log("Salon data successfully retrieved:", fetchedSalonData);
              salonData = fetchedSalonData;
            } else {
              console.warn(`No salon found with ID: ${dealData.salon_id}. This might indicate a data consistency issue.`);
              
              // Additional diagnostic check - verify if the salon exists at all
              const { count, error: countError } = await supabase
                .from("salons")
                .select("*", { count: 'exact', head: true });
                
              if (countError) {
                console.error("Error checking salon table:", countError);
              } else {
                console.log(`Total number of salons in database: ${count}`);
              }
              
              // Try to get all salon IDs to check if the ID exists
              const { data: allSalonIds, error: idsError } = await supabase
                .from("salons")
                .select("id")
                .limit(20);
                
              if (idsError) {
                console.error("Error fetching salon IDs:", idsError);
              } else {
                console.log("Available salon IDs in database:", allSalonIds.map(s => s.id));
              }
            }
          } catch (salonFetchError) {
            console.error("Unexpected error during salon data fetch:", salonFetchError);
          }
        } else {
          console.log("No salon_id provided in deal data, using default salon data");
        }
        
        // Calculate days remaining
        const calculateDaysRemaining = () => {
          if (!dealData.expiration_date) {
            // If no expiration date, parse days from time_remaining or default to 30
            if (dealData.time_remaining && dealData.time_remaining.includes("dag")) {
              const daysText = dealData.time_remaining.split(" ")[0];
              return parseInt(daysText) || 30;
            }
            return 30;
          }
          
          const expirationDate = new Date(dealData.expiration_date);
          const now = new Date();
          
          // Set both dates to midnight to avoid time differences
          expirationDate.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);
          
          const diffTime = expirationDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return diffDays > 0 ? diffDays : 0;
        };

        const daysRemaining = calculateDaysRemaining();

        // Determine if the deal is free
        const isFree = dealData.is_free || dealData.discounted_price === 0;

        return {
          id: dealData.id,
          title: dealData.title,
          description: dealData.description,
          imageUrl: dealData.image_url,
          originalPrice: dealData.original_price,
          discountedPrice: dealData.discounted_price,
          daysRemaining,
          expirationDate: dealData.expiration_date || new Date().toISOString(),
          category: dealData.category,
          city: dealData.city,
          created_at: dealData.created_at,
          quantityLeft: dealData.quantity_left,
          isFree: isFree,
          salon: salonData,
          booking_url: dealData.booking_url,
        };
      } catch (error) {
        console.error("Error in useDeal hook:", error);
        if (error instanceof Error) {
          toast.error(error.message === 'No deal ID provided' ? "Inget erbjudande-ID angivet" :
                    error.message === 'Invalid deal ID' ? "Ogiltigt erbjudande-ID" : 
                    "Erbjudandet kunde inte hittas");
        } else {
          toast.error("Ett oväntat fel uppstod");
        }
        throw error;
      }
    },
    staleTime: 0, // Reduce cache time to ensure fresh data
    refetchOnWindowFocus: true, // Update when window gets focus
  });
};
