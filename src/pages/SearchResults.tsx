import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DealsGrid } from "@/components/DealsGrid";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { Deal } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "Alla Städer");

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      console.log('Starting deals fetch with params:', {
        query: searchParams.get("q"),
        category: searchParams.get("category"),
        city: searchParams.get("city")
      });

      try {
        // First, test connection
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

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
      <div className="space-y-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till startsidan
          </Button>
        </Link>

        <Categories 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />
        <Cities 
          selectedCity={selectedCity} 
          onSelectCity={handleCitySelect} 
        />
        
        <h1 className="text-2xl font-bold">
          {deals.length} erbjudanden hittades
        </h1>
        
        <DealsGrid deals={deals} />
      </div>
    </div>
  );
}