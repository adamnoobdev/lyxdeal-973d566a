import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { toast } from "sonner";

interface SearchParams {
  query?: string;
  category?: string;
  city?: string;
}

export const useSearchDeals = (searchParams: URLSearchParams) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      console.log('Starting deals fetch with params:', {
        query: searchParams.get("q"),
        category: searchParams.get("category"),
        city: searchParams.get("city")
      });

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Current session:', sessionData);

        const query = searchParams.get("q")?.toLowerCase() || "";
        const category = searchParams.get("category");
        const city = searchParams.get("city");

        let supabaseQuery = supabase
          .from("deals")
          .select("*");

        if (query) {
          console.log('Applying search filter:', query);
          supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
        }

        if (category && category !== "Alla Erbjudanden") {
          console.log('Applying category filter:', category);
          supabaseQuery = supabaseQuery.eq("category", category);
        }

        if (city && city !== "Alla Städer") {
          console.log('Applying city filter:', city);
          supabaseQuery = supabaseQuery.eq("city", city);
        }

        const { data, error } = await supabaseQuery;

        if (error) {
          console.error("Error fetching deals:", error);
          toast.error("Kunde inte hämta erbjudanden. Försök igen senare.");
          return;
        }

        console.log('Deals fetch successful:', {
          totalDeals: data?.length || 0,
          firstDeal: data?.[0]
        });

        setDeals(data as Deal[]);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Ett oväntat fel uppstod när erbjudanden skulle hämtas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [searchParams]);

  return { deals, isLoading };
};