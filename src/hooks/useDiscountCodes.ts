
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DiscountCode } from "@/components/discount-codes/DiscountCodesTable";

export const useDiscountCodes = (dealId: number | undefined) => {
  const {
    data: discountCodes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["discount-codes", dealId],
    queryFn: async () => {
      if (!dealId) return [];

      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching discount codes:", error);
        throw error;
      }

      return data as DiscountCode[];
    },
    enabled: !!dealId,
  });

  return {
    discountCodes,
    isLoading,
    error,
    refetch,
  };
};
