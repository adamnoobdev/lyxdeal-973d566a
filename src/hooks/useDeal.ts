
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeal = (id: string | undefined) => {
  return useQuery({
    queryKey: ["deal", id],
    queryFn: async () => {
      try {
        if (!id) {
          toast.error("Inget erbjudande-ID angivet");
          throw new Error("No deal ID provided");
        }
        
        const dealId = parseInt(id);
        if (isNaN(dealId)) {
          toast.error("Ogiltigt erbjudande-ID");
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
          console.error("Error fetching deal:", error);
          toast.error("Kunde inte hämta erbjudandet. Försök igen senare.");
          throw error;
        }

        if (!data) {
          toast.error("Erbjudandet kunde inte hittas");
          throw new Error("Deal not found");
        }

        return {
          id: data.id,
          title: data.title,
          description: data.description,
          imageUrl: data.image_url,
          originalPrice: data.original_price,
          discountedPrice: data.discounted_price,
          timeRemaining: data.time_remaining,
          category: data.category,
          city: data.city,
          created_at: data.created_at,
          quantityLeft: data.quantity_left,
          isFree: data.is_free || false, // Add the isFree property
          salon: data.salons ? {
            name: data.salons.name,
            address: data.salons.address,
            phone: data.salons.phone,
          } : null,
        };
      } catch (error) {
        console.error("Unexpected error:", error);
        if (error instanceof Error) {
          throw error;
        }
        toast.error("Ett oväntat fel uppstod. Försök igen senare.");
        throw new Error("Failed to fetch deal");
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof Error) {
        return !['No deal ID provided', 'Invalid deal ID', 'Deal not found'].includes(error.message);
      }
      return failureCount < 1;
    },
  });
};
