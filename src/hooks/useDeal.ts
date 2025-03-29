
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

        // Först, hämta erbjudandet 
        let { data: dealData, error: dealError } = await supabase
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

        // När vi har deal-datan, hämta salongsdata separat med tydligare loggning
        let salonData = null;
        if (dealData.salon_id) {
          console.log("Fetching salon with ID:", dealData.salon_id);
          
          const { data: fetchedSalonData, error: salonError } = await supabase
            .from("salons")
            .select("id, name, address, phone")
            .eq("id", dealData.salon_id)
            .single(); // Using single() instead of maybeSingle() as we know the ID should exist
            
          if (salonError) {
            console.error("Error fetching salon data:", salonError.message, salonError);
            
            // Try with a different approach using maybeSingle
            console.log("Retrying with maybeSingle");
            const { data: retryData, error: retryError } = await supabase
              .from("salons")
              .select("id, name, address, phone")
              .eq("id", dealData.salon_id)
              .maybeSingle();
              
            if (!retryError && retryData) {
              salonData = retryData;
              console.log("Salon data retrieved with maybeSingle:", salonData);
            } else if (retryError) {
              console.error("Retry error fetching salon:", retryError);
            } else {
              console.log("No salon found with ID:", dealData.salon_id);
            }
          } else {
            salonData = fetchedSalonData;
            console.log("Salon data retrieved:", salonData);
          }
        }
        
        // Skapa en definitiv salongsstruktur, oavsett om vi fick data eller inte
        const finalSalonData = salonData || {
          id: dealData.salon_id || null,
          name: dealData.city ? `Salong i ${dealData.city}` : 'Okänd salong',
          address: dealData.city || null,
          phone: null
        };

        console.log("Final salon data:", finalSalonData);
        
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
          salon: finalSalonData,
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
    staleTime: 0, // Minska cache-tiden för att säkerställa färsk data
    refetchOnWindowFocus: true, // Uppdatera när fönstret får fokus
  });
};
