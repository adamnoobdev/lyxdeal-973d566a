
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
        const { data, error } = await supabase
          .from("deals")
          .select("*")
          .eq("id", dealId)
          .single();

        if (error) {
          console.error("Error fetching deal:", error);
          throw error;
        }

        if (!data) {
          throw new Error("Deal not found");
        }

        console.log("Raw deal data from DB:", data);

        // Calculate days remaining
        const calculateDaysRemaining = () => {
          if (!data.expiration_date) {
            // If no expiration date, parse days from time_remaining or default to 30
            if (data.time_remaining && data.time_remaining.includes("dag")) {
              const daysText = data.time_remaining.split(" ")[0];
              return parseInt(daysText) || 30;
            }
            return 30;
          }
          
          const expirationDate = new Date(data.expiration_date);
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
        const isFree = data.is_free || data.discounted_price === 0;

        // Om vi har ett salon_id, hämta salongsinformation
        let salon = null;
        
        if (data.salon_id) {
          console.log("Fetching salon data for salon_id:", data.salon_id);
          
          const { data: salonData, error: salonError } = await supabase
            .from("salons")
            .select("id, name, address, phone")
            .eq("id", data.salon_id);
            
          if (!salonError && salonData && salonData.length > 0) {
            salon = {
              id: salonData[0].id,
              name: salonData[0].name || '',
              address: salonData[0].address || null,
              phone: salonData[0].phone || null,
            };
            console.log("Successfully fetched salon data:", salon);
          } else {
            console.error("Error or no data when fetching salon:", salonError);
            // Fallback till att använda staden som en del av salongen om hämtning misslyckas
            salon = {
              id: null,
              name: `Salong i ${data.city}`,
              address: data.city || null,
              phone: null,
            };
          }
        } else {
          // Om vi inte har ett salon_id, använd staden som en del av salongen
          salon = {
            id: null,
            name: `Salong i ${data.city}`,
            address: data.city || null,
            phone: null,
          };
          console.log("No salon_id available, created fallback salon data:", salon);
        }

        console.log("Final processed salon data:", salon);

        return {
          id: data.id,
          title: data.title,
          description: data.description,
          imageUrl: data.image_url,
          originalPrice: data.original_price,
          discountedPrice: data.discounted_price,
          daysRemaining,
          expirationDate: data.expiration_date || new Date().toISOString(),
          category: data.category,
          city: data.city,
          created_at: data.created_at,
          quantityLeft: data.quantity_left,
          isFree: isFree,
          salon: salon,
          booking_url: data.booking_url,
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
