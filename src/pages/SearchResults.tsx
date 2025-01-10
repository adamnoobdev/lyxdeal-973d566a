import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DealCard } from "@/components/DealCard";
import { Deal } from "@/types/deal";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      const query = searchParams.get("q")?.toLowerCase() || "";
      const category = searchParams.get("category");
      const city = searchParams.get("city");

      let supabaseQuery = supabase
        .from("deals")
        .select("*");

      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (category) {
        supabaseQuery = supabaseQuery.eq("category", category);
      }

      if (city) {
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {deals.length} erbjudanden hittades
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} {...deal} />
        ))}
      </div>
    </div>
  );
}