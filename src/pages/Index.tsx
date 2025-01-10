import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { DealsGrid } from "@/components/DealsGrid";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { SearchBar } from "@/components/SearchBar";
import { Deal } from "@/types/deal";

export default function IndexPage() {
  const { data: deals, isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deal[];
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Hitta ditt nästa erbjudande</h1>
        <p className="text-lg text-muted-foreground">
          Upptäck de bästa skönhetserbjudandena i din stad
        </p>
      </div>

      <SearchBar />

      <div className="space-y-8">
        <Categories />
        <Cities />
      </div>

      <FeaturedDeals />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        deals && <DealsGrid deals={deals} />
      )}
    </div>
  );
}