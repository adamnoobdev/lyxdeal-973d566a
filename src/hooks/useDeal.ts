
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
