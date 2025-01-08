import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DealCard } from "@/components/DealCard";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { useDeals } from "@/hooks/useDeals";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "Alla Erbjudanden";
  const cityParam = searchParams.get("city") || "Alla Städer";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCity, setSelectedCity] = useState(cityParam);

  const { data: deals = [], isLoading } = useDeals(
    selectedCategory === "Alla Erbjudanden" ? undefined : selectedCategory,
    selectedCity === "Alla Städer" ? undefined : selectedCity
  );

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedCity(cityParam);
  }, [categoryParam, cityParam]);

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = searchQuery
      ? deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.city.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category !== "Alla Erbjudanden") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    window.history.pushState({}, "", `?${params.toString()}`);
    setSelectedCategory(category);
  };

  const handleCitySelect = (city: string) => {
    const params = new URLSearchParams(searchParams);
    if (city !== "Alla Städer") {
      params.set("city", city);
    } else {
      params.delete("city");
    }
    window.history.pushState({}, "", `?${params.toString()}`);
    setSelectedCity(city);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Sökresultat för "${searchQuery}"`
              : selectedCategory}
          </h1>
          <p className="text-gray-600">
            {filteredDeals.length} erbjudanden hittades
          </p>
        </div>

        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        <Cities
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} {...deal} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;