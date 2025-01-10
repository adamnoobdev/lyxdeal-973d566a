import { useState } from "react";
import { useDeals } from "@/hooks/useDeals";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FiltersSection } from "@/components/home/FiltersSection";
import { DealsSection } from "@/components/home/DealsSection";
import { toast } from "sonner";

export default function IndexPage() {
  console.log('Rendering IndexPage');
  const [selectedCategory, setSelectedCategory] = useState<string>("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState<string>("Alla Städer");

  const { data: deals, isLoading, error } = useDeals(
    selectedCategory === "Alla Erbjudanden" ? undefined : selectedCategory,
    selectedCity === "Alla Städer" ? undefined : selectedCity
  );

  console.log('IndexPage state:', {
    selectedCategory,
    selectedCity,
    dealsCount: deals?.length,
    isLoading,
    hasError: !!error
  });

  if (error) {
    console.error('Error fetching deals:', error);
    toast.error('Ett fel uppstod när erbjudanden skulle hämtas');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        <StatsSection />
        <FiltersSection
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          onSelectCategory={setSelectedCategory}
          onSelectCity={setSelectedCity}
        />
        <DealsSection 
          deals={deals} 
          isLoading={isLoading} 
          error={error as Error | null}
        />
      </main>
    </div>
  );
}