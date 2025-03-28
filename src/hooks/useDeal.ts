
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

        // Fetch the deal with salon data in a single query
        const { data, error } = await supabase
          .from("deals")
          .select(`
            *,
            salon:salons!deals_salon_id_fkey (
              id,
              name,
              address,
              phone
            )
          `)
          .eq("id", dealId)
          .single();

        if (error) {
          console.error("Supabase error fetching deal:", error);
          throw error;
        }

        if (!data) {
          console.error("No data returned for deal ID:", dealId);
          throw new Error("Deal not found");
        }

        console.log("Deal data:", data);

        // Calculate days remaining
        const calculateDaysRemaining = () => {
          // If no expiration_date in the database, parse days from time_remaining or default to 30
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

        // Determine if the deal is free either by explicit flag or 0 price
        const isFree = data.is_free || data.discounted_price === 0;

        // If salon data is missing from the join, attempt to fetch it directly
        let salon = null;
        
        if (data.salon) {
          salon = {
            id: data.salon.id,
            name: data.salon.name || '',
            address: data.salon.address || null,
            phone: data.salon.phone || null,
          };
          console.log("Found salon data via data.salon:", salon);
        } else if (data.salon_id) {
          // If salon data is missing but we have a salon_id, try to fetch it separately
          console.log("Attempting to fetch salon data separately with salon_id:", data.salon_id);
          try {
            const { data: salonData, error: salonError } = await supabase
              .from("salons")
              .select("id, name, address, phone")
              .eq("id", data.salon_id)
              .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found
              
            if (!salonError && salonData) {
              salon = {
                id: salonData.id,
                name: salonData.name || '',
                address: salonData.address || null,
                phone: salonData.phone || null,
              };
              console.log("Successfully fetched salon data separately:", salon);
            } else {
              // Create a fallback salon object with city information
              salon = {
                id: null,
                name: `Salong i ${data.city}`,
                address: `${data.city}`,
                phone: null,
              };
              console.log("Created fallback salon data:", salon);
            }
          } catch (error) {
            console.error("Error fetching salon data:", error);
            // Create a fallback salon object with city information
            salon = {
              id: null,
              name: `Salong i ${data.city}`,
              address: `${data.city}`,
              phone: null,
            };
            console.log("Created fallback salon data after error:", salon);
          }
        } else {
          // Create a fallback salon object with city information if no salon_id
          salon = {
            id: null,
            name: `Salong i ${data.city}`,
            address: `${data.city}`,
            phone: null,
          };
          console.log("Created fallback salon data (no salon_id):", salon);
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
        console.error("Error fetching deal:", error);
        if (error instanceof Error) {
          if (['No deal ID provided', 'Invalid deal ID', 'Deal not found'].includes(error.message)) {
            toast.error(error.message === 'No deal ID provided' ? "Inget erbjudande-ID angivet" :
                      error.message === 'Invalid deal ID' ? "Ogiltigt erbjudande-ID" : 
                      "Erbjudandet kunde inte hittas");
          } else {
            toast.error("Ett fel uppstod när erbjudandet skulle hämtas");
          }
          throw error;
        }
        toast.error("Ett oväntat fel uppstod");
        throw new Error("Failed to fetch deal");
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
