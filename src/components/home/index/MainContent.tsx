
import { memo } from "react";
import { CategorySection } from "./CategorySection";
import { StatsSection } from "../sections/StatsSection";
import { DealsSection } from "../sections/DealsSection";

interface MainContentProps {
  selectedCategory: string;
  selectedCity: string;
  onSelectCategory: (category: string) => void;
  onSelectCity: (city: string) => void;
}

const MainContentComponent = ({
  selectedCategory,
  selectedCity,
  onSelectCategory,
  onSelectCity
}: MainContentProps) => {
  return (
    <main className="flex-1 container mx-auto py-8 space-y-8 px-0">
      <StatsSection />
      <CategorySection 
        selectedCategory={selectedCategory} 
        selectedCity={selectedCity} 
        onSelectCategory={onSelectCategory} 
        onSelectCity={onSelectCity} 
      />
      <DealsSection 
        selectedCategory={selectedCategory} 
        selectedCity={selectedCity} 
      />
    </main>
  );
};

export const MainContent = memo(MainContentComponent);
