
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

        const { data, error } = await supabase
          .from("deals")
          .select(`
            *,
            salons (
              name,
              address,
              phone
            )
          `)
          .eq("id", dealId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Deal not found");
        }

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
          isFree: data.is_free || false,
          salon: data.salons ? {
            name: data.salons.name,
            address: data.salons.address,
            phone: data.salons.phone,
          } : null,
        };
      } catch (error) {
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
    staleTime: 5 * 60 * 1000, // Cache i 5 minuter
    refetchOnWindowFocus: false,
  });
};
