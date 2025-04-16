
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type DealOption = {
  value: string;
  label: string;
};

export function useDealOptions(salonId: number | undefined) {
  const [dealOptions, setDealOptions] = useState<DealOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      if (!salonId) {
        setDealOptions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("deals")
          .select("id, title")
          .eq("salon_id", salonId)
          .eq("is_active", true)
          .eq("status", "approved")
          .order("title");

        if (error) throw error;

        const options = data.map((deal) => ({
          value: deal.id.toString(),
          label: deal.title,
        }));

        setDealOptions(options);
      } catch (err) {
        console.error("Error fetching deal options:", err);
        setError("Kunde inte hämta erbjudanden");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeals();
  }, [salonId]);

  return { dealOptions, isLoading, error };
}
