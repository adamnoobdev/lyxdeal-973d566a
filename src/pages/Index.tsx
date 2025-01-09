import { useState, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { DealsGrid } from "@/components/DealsGrid";
import { useDeals, useFeaturedDeals } from "@/hooks/useDeals";
import { toast } from "sonner";
import { type Category, type City } from "@/constants/app-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState<City>("Alla Städer");

  const { data: deals = [], isLoading: isDealsLoading, error: dealsError } = useDeals(
    selectedCategory === "Alla Erbjudanden" ? undefined : selectedCategory,
    selectedCity === "Alla Städer" ? undefined : selectedCity
  );
  
  const { 
    data: featuredDeals = [], 
    isLoading: isFeaturedLoading, 
    error: featuredError 
  } = useFeaturedDeals();

  const { data: { publicUrl } } = supabase
    .storage
    .from('assets')
    .getPublicUrl('luxury-spa-treatment.jpg');

  const handleDealClick = useCallback((dealId: number) => {
    try {
      navigate(`/deal/${dealId}`);
    } catch (error) {
      console.error("Navigeringsfel:", error);
      toast.error("Ett fel uppstod. Försök igen.");
    }
  }, [navigate]);

  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category);
    if (category !== "Alla Erbjudanden") {
      navigate(`/search?category=${encodeURIComponent(category)}`);
    }
  }, [navigate]);

  const handleCitySelect = useCallback((city: City) => {
    setSelectedCity(city);
  }, []);

  if (dealsError || featuredError) {
    console.error('Deals error:', dealsError);
    console.error('Featured deals error:', featuredError);
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Ett fel uppstod när erbjudandena skulle hämtas
        </h2>
        <p className="text-gray-600">
          Försök att ladda om sidan eller kom tillbaka senare.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[200px] md:h-[400px] w-full mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${publicUrl})`,
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-6 animate-fade-in">
              Sveriges Hetaste Lyxdeals
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-2xl mb-6 animate-fade-in">
              Upptäck exklusiva erbjudanden på professionella behandlingar hos Sveriges mest utvalda salonger.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <Categories 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />

        <Cities
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />

        {isFeaturedLoading ? (
          <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
        ) : featuredDeals.length > 0 ? (
          <div className="mb-8">
            <FeaturedDeals deals={featuredDeals} />
          </div>
        ) : null}

        {isDealsLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <DealsGrid 
            deals={deals} 
            onDealClick={handleDealClick}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">
              Inga erbjudanden hittades för de valda filtren.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;