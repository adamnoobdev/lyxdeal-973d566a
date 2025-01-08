import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeal = (id: string) => {
  return useQuery({
    queryKey: ["deal", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching deal:", error);
        toast.error("Kunde inte hämta erbjudandet");
        throw error;
      }

      if (!data) {
        toast.error("Erbjudandet hittades inte");
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
      };
    },
  });
};