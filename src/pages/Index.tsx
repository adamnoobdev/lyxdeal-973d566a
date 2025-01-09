import { useState, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { DealsGrid } from "@/components/DealsGrid";
import { useDeals, useFeaturedDeals } from "@/hooks/useDeals";
import { toast } from "sonner";
import { type Category, type City, CATEGORIES } from "@/constants/app-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CategoryBadge } from "@/components/CategoryBadge";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState<City>("Alla Städer");

  const { data: deals = [], isLoading: isDealsLoading } = useDeals(
    selectedCategory,
    selectedCity
  );
  const { data: featuredDeals = [], isLoading: isFeaturedLoading } = useFeaturedDeals();

  const { data: { publicUrl } } = supabase
    .storage
    .from('assets')
    .getPublicUrl('luxury-spa-treatment.jpg');

  const handleDealClick = useCallback((dealId: number) => {
    try {
      navigate(`/product/${dealId}`);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[300px] md:h-[600px] w-full mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${publicUrl})`,
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="container relative h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-6 animate-fade-in">
              Sveriges Lyxigaste Skönhetsupplevelser
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-2xl mb-6 animate-fade-in">
              Upptäck exklusiva erbjudanden på professionella behandlingar hos Sveriges mest utvalda salonger.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
              {CATEGORIES.filter(category => category !== "Alla Erbjudanden").map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <CategoryBadge 
                    category={category} 
                    variant="default"
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 md:py-8">
        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
          <div className="relative mb-4 md:mb-8">
            {!isFeaturedLoading && featuredDeals.length > 0 && (
              <FeaturedDeals deals={featuredDeals} />
            )}
          </div>
        </Suspense>

        <Categories 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />

        <Cities
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />

        <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
          {!isDealsLoading && (
            <DealsGrid 
              deals={deals} 
              onDealClick={handleDealClick}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Index;