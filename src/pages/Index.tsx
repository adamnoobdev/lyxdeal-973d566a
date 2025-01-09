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

  const { data: deals = [], isLoading: isDealsLoading } = useDeals(
    selectedCategory,
    selectedCity
  );
  const { data: featuredDeals = [], isLoading: isFeaturedLoading } = useFeaturedDeals();

  const { data: { publicUrl } } = supabase
    .storage
    .from('assets')
    .getPublicUrl('beauty-header.jpg');

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
      <div className="relative h-[500px] md:h-[600px] w-full mb-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url(${publicUrl})`,
            backgroundPosition: "center 30%"
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-400 via-primary to-purple-800 opacity-90" />
          
          <div className="absolute inset-0">
            <div className="container relative h-full flex flex-col justify-center items-center text-center px-4">
              <div className="relative space-y-8 max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-primary rounded-lg blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
                  <h1 className="relative text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
                    Skäm Bort Dig Själv!
                  </h1>
                </div>
                
                <div className="relative px-6 py-8 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-xl">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-primary rounded-2xl opacity-20 blur-lg"></div>
                  <p className="relative text-xl md:text-2xl text-white leading-relaxed">
                    Upptäck exklusiva erbjudanden på professionella skönhetsbehandlingar och hårvård. 
                    <span className="block mt-2 font-light">
                      Unna dig lyxig kvalitetsvård till oslagbara priser hos våra utvalda salonger.
                    </span>
                  </p>
                </div>
              </div>
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