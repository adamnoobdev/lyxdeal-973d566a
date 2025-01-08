import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { DealsGrid } from "@/components/DealsGrid";
import { useDeals, useFeaturedDeals } from "@/hooks/useDeals";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState("Alla Städer");
  const [isLoading, setIsLoading] = useState(false);

  const { data: deals = [], isLoading: isDealsLoading } = useDeals(
    selectedCategory,
    selectedCity
  );
  const { data: featuredDeals = [], isLoading: isFeaturedLoading } = useFeaturedDeals();

  const handleSearch = (query: string) => {
    try {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Sökfel:", error);
      toast.error("Ett fel uppstod vid sökningen. Försök igen.");
    }
  };

  const handleCategorySelect = (category: string) => {
    try {
      setIsLoading(true);
      setSelectedCategory(category);
      if (category !== "Alla Erbjudanden") {
        navigate(`/search?category=${encodeURIComponent(category)}`);
      }
    } catch (error) {
      console.error("Kategorifel:", error);
      toast.error("Ett fel uppstod vid val av kategori. Försök igen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleDealClick = (dealId: number) => {
    try {
      navigate(`/product/${dealId}`);
    } catch (error) {
      console.error("Navigeringsfel:", error);
      toast.error("Ett fel uppstod. Försök igen.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="relative mb-8">
          {!isFeaturedLoading && featuredDeals.length > 0 && (
            <FeaturedDeals deals={featuredDeals} />
          )}
        </div>

        <Categories 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />

        <Cities
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />

        {!isDealsLoading && (
          <DealsGrid deals={deals} onDealClick={handleDealClick} />
        )}
      </div>
    </div>
  );
};

export default Index;