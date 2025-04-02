
import { useDeals } from "@/hooks/useDeals";
import { CITIES, City } from "@/constants/app-constants";
import { useMemo } from "react";

export const useCityDealsData = (selectedCategory: string, selectedCity: string) => {
  // Get all cities to check which ones have deals
  const { data: allDeals, isLoading: isLoadingAllDeals } = useDeals(
    selectedCategory === "Alla Erbjudanden" ? undefined : selectedCategory, 
    "Alla Städer"
  );
  
  // Create a list of cities that have active deals
  const citiesWithDeals = useMemo(() => {
    if (!allDeals) return [] as City[];
    
    // Get unique cities from deals
    const uniqueCities = [...new Set(allDeals.map(deal => deal.city))] as City[];
    
    // Return cities in the order they appear in the CITIES constant
    // but only include cities that have deals
    return CITIES.filter(city => 
      city === "Alla Städer" || uniqueCities.includes(city as City)
    );
  }, [allDeals]);

  // Determine which cities to show and in what order
  const orderedCities = useMemo(() => {
    if (isLoadingAllDeals) {
      // During loading, show a subset of cities to prevent layout jumps
      return selectedCity !== "Alla Städer" 
        ? [selectedCity as City] 
        : CITIES.filter(city => city !== "Alla Städer").slice(0, 3) as City[];
    }
    
    if (selectedCity !== "Alla Städer") {
      // If a specific city is selected, show it first, followed by other cities with deals
      return [
        selectedCity as City,
        ...citiesWithDeals.filter(city => 
          city !== "Alla Städer" && city !== selectedCity
        )
      ] as City[];
    }
    
    // Default: show all cities with deals except "Alla Städer"
    return citiesWithDeals.filter(city => city !== "Alla Städer") as City[];
  }, [selectedCity, citiesWithDeals, isLoadingAllDeals]);

  return {
    isLoading: isLoadingAllDeals,
    citiesWithDeals: citiesWithDeals as City[],
    orderedCities: orderedCities as City[]
  };
};
