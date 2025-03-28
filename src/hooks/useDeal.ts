
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

        // First, try to fetch the deal with salon data using a join
        const { data, error } = await supabase
          .from("deals")
          .select(`
            *,
            salon:salons(id, name, address, phone)
          `)
          .eq("id", dealId)
          .single();

        if (error) {
          console.error("Error fetching deal with join:", error);
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

        // Extract and format salon data properly
        let salon = null;
        
        // Log what's in the salon field from the join
        console.log("Raw salon data from join:", data.salon);
        
        if (data.salon && Array.isArray(data.salon) && data.salon.length > 0) {
          // Handle array of salon data
          const salonData = data.salon[0];
          salon = {
            id: salonData.id,
            name: salonData.name || '',
            address: salonData.address || null,
            phone: salonData.phone || null,
          };
          console.log("Extracted salon data from array:", salon);
        } else if (data.salon && !Array.isArray(data.salon) && data.salon.id) {
          // Handle direct salon object data
          salon = {
            id: data.salon.id,
            name: data.salon.name || '',
            address: data.salon.address || null,
            phone: data.salon.phone || null,
          };
          console.log("Extracted salon data from object:", salon);
        } else if (data.salon_id) {
          // Fetch salon data directly if the join didn't work but we have salon_id
          console.log("Fetching salon data directly with salon_id:", data.salon_id);
          const { data: salonData, error: salonError } = await supabase
            .from("salons")
            .select("id, name, address, phone")
            .eq("id", data.salon_id)
            .single();
            
          if (!salonError && salonData) {
            salon = {
              id: salonData.id,
              name: salonData.name || '',
              address: salonData.address || null,
              phone: salonData.phone || null,
            };
            console.log("Successfully fetched salon data directly:", salon);
          } else {
            console.error("Error fetching salon data directly:", salonError);
          }
        }

        // If we still don't have salon data, create a fallback
        if (!salon) {
          salon = {
            id: null,
            name: `Salong i ${data.city}`,
            address: data.city || null,
            phone: null,
          };
          console.log("Created fallback salon data:", salon);
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
