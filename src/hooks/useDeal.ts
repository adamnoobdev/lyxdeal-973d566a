
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

        // First, let's check if the deal has a salon_id
        const { data: dealCheck, error: dealCheckError } = await supabase
          .from("deals")
          .select(`
            id,
            salon_id
          `)
          .eq("id", dealId)
          .single();

        if (dealCheckError) {
          console.error("Error checking deal salon_id:", dealCheckError);
          throw dealCheckError;
        }

        console.log("Deal check result:", dealCheck);

        // Now fetch the full deal with salon data
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
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", error);
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

        // Process salon data correctly, checking both data.salon and data.salons
        let salon = null;
        
        if (data.salon) {
          salon = {
            id: data.salon.id,
            name: data.salon.name || '',
            address: data.salon.address || null,
            phone: data.salon.phone || null,
          };
          console.log("Found salon data via data.salon:", salon);
        } else if (data.salons) {
          salon = {
            id: data.salons.id,
            name: data.salons.name || '',
            address: data.salons.address || null,
            phone: data.salons.phone || null,
          };
          console.log("Found salon data via data.salons:", salon);
        } else if (dealCheck && dealCheck.salon_id) {
          // If we have a salon_id but no salon data in the main query, try to fetch it directly
          console.log("Attempting to fetch salon data separately with salon_id:", dealCheck.salon_id);
          const { data: salonData, error: salonError } = await supabase
            .from("salons")
            .select("id, name, address, phone")
            .eq("id", dealCheck.salon_id)
            .maybeSingle();
            
          if (!salonError && salonData) {
            salon = {
              id: salonData.id,
              name: salonData.name || '',
              address: salonData.address || null,
              phone: salonData.phone || null,
            };
            console.log("Successfully fetched salon data separately:", salon);
          } else {
            console.error("Failed to fetch salon data separately:", salonError);
          }
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
