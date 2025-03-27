
import { memo } from "react";
import { StatsSection } from "../sections/StatsSection";
import { DealsSection } from "../sections/DealsSection";
import { CategorySection } from "./CategorySection";

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
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <CategorySection 
            selectedCategory={selectedCategory}
            selectedCity={selectedCity}
            onSelectCategory={onSelectCategory}
            onSelectCity={onSelectCity}
          />
        </div>
        
        <div className="lg:col-span-3">
          <StatsSection />
          <DealsSection 
            selectedCategory={selectedCategory} 
            selectedCity={selectedCity} 
          />
        </div>
      </div>
    </div>
  );
};

export const MainContent = memo(MainContentComponent);
