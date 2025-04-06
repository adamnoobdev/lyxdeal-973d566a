
import { useState, useEffect } from "react";
import { URLSearchParams } from "url";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";

export const useSearchResults = (searchParams: URLSearchParams) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "Alla Städer");

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      const query = searchParams.get("q")?.toLowerCase() || "";
      const category = searchParams.get("category");
      const city = searchParams.get("city");

      let supabaseQuery = supabase
        .from("deals")
        .select("*")
        .eq("is_active", true) // Endast aktiva erbjudanden
        .eq("status", "approved") // Endast godkända erbjudanden
        .order("created_at", { ascending: false });

      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (category && category !== "Alla Erbjudanden") {
        supabaseQuery = supabaseQuery.eq("category", category);
      }

      if (city && city !== "Alla Städer") {
        supabaseQuery = supabaseQuery.eq("city", city);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error("Error fetching deals:", error);
        return;
      }

      setDeals(data as Deal[]);
      setIsLoading(false);
    };

    fetchDeals();
  }, [searchParams]);

  return {
    deals,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity
  };
};
