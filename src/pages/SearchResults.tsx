
import { useSearchParams } from "react-router-dom";
import { useSearchResults } from "@/hooks/useSearchResults";
import { SearchResultsContent } from "@/components/search/SearchResultsContent";
import { SearchLoadingState } from "@/components/search/SearchLoadingState";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    deals,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity
  } = useSearchResults(searchParams);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category !== "Alla Erbjudanden") {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const newParams = new URLSearchParams(searchParams);
    if (city !== "Alla Städer") {
      newParams.set("city", city);
    } else {
      newParams.delete("city");
    }
    setSearchParams(newParams);
  };

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "Alla Erbjudanden";
  const city = searchParams.get("city") || "Alla Städer";
  
  const pageTitle = query 
    ? `${query} - Skönhetserbjudanden i ${city !== "Alla Städer" ? city : "Sverige"}`
    : `${category !== "Alla Erbjudanden" ? category : "Skönhetserbjudanden"} i ${city !== "Alla Städer" ? city : "Sverige"}`;
  
  const pageDescription = `Hitta de bästa ${category !== "Alla Erbjudanden" ? category.toLowerCase() : "skönhetserbjudandena"} i ${city !== "Alla Städer" ? city : "hela Sverige"}. Spara pengar på kvalitetsbehandlingar.`;

  if (isLoading) {
    return (
      <SearchLoadingState 
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />
    );
  }

  return (
    <SearchResultsContent
      deals={deals}
      query={query}
      category={category}
      city={city}
      selectedCategory={selectedCategory}
      selectedCity={selectedCity}
      searchParams={searchParams}
      onCategorySelect={handleCategorySelect}
      onCitySelect={handleCitySelect}
    />
  );
}
