
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

        // Först, hämta erbjudandet med en mer detaljerad fråga
        const { data: dealData, error: dealError } = await supabase
          .from("deals")
          .select("*, salon:salons(id, name, address, phone)")
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

        // Om första försöket att hämta salong misslyckades, gör ett andra separat försök
        let salon = null;
        
        if (dealData.salon) {
          // Salong har redan laddats från den kopplade frågan
          salon = dealData.salon;
          console.log("Salon data retrieved from join query:", salon);
        } else if (dealData.salon_id) {
          console.log("First salon fetch attempt failed, trying direct fetch for salon_id:", dealData.salon_id);
          
          // Gör ett separat försök att hämta salongsinformation
          const { data: salonData, error: salonError } = await supabase
            .from("salons")
            .select("id, name, address, phone")
            .eq("id", dealData.salon_id);
            
          if (!salonError && salonData && salonData.length > 0) {
            salon = {
              id: salonData[0].id,
              name: salonData[0].name || '',
              address: salonData[0].address || null,
              phone: salonData[0].phone || null,
            };
            console.log("Successfully fetched salon data in second attempt:", salon);
          } else {
            console.error("Error or no data when fetching salon in second attempt:", salonError);
            console.error("Response returned from salons table:", salonData);
            
            // Fallback till att använda staden som en del av salongen om hämtning misslyckas
            salon = {
              id: null,
              name: `Salong i ${dealData.city}`,
              address: dealData.city || null,
              phone: null,
            };
          }
        } else {
          // Om vi inte har ett salon_id, använd staden som en del av salongen
          salon = {
            id: null,
            name: `Salong i ${dealData.city}`,
            address: dealData.city || null,
            phone: null,
          };
          console.log("No salon_id available, created fallback salon data:", salon);
        }

        console.log("Final processed salon data:", salon);

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
          salon: salon,
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
