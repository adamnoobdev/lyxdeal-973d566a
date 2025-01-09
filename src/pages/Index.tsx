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
      <div className="relative h-[600px] w-full mb-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${publicUrl})`,
            backgroundPosition: "center 30%"
          }}
        />
        
        <div className="absolute inset-0 bg-[#E87CE8]/90">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '30px 30px'
               }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/40" />
        </div>

        <div className="relative container h-full">
          <div className="h-full flex flex-col justify-center items-center text-center">
            <div className="space-y-8 max-w-3xl mx-auto px-4">
              <div className="space-y-2">
                <h2 className="text-white/90 text-xl md:text-2xl font-light tracking-wide animate-fade-in">
                  Välkommen till din oas
                </h2>
                <h1 className="text-5xl md:text-7xl font-bold text-white animate-fade-in">
                  Skäm Bort 
                  <span className="block">Dig Själv</span>
                </h1>
              </div>
              
              <div className="relative">
                <div className="h-px w-24 bg-gradient-to-r from-white/40 to-transparent mb-6 mx-auto" />
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light animate-fade-in">
                  Upptäck exklusiva erbjudanden på professionella skönhetsbehandlingar och hårvård
                  <span className="block mt-2 text-lg md:text-xl text-white/80">
                    hos våra utvalda salonger
                  </span>
                </p>
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