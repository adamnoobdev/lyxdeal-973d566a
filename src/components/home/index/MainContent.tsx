
import { memo } from "react";
import { StatsSection } from "../sections/StatsSection";
import { DealsSection } from "../sections/DealsSection";
import { PromotionBanner } from "../sections/PromotionBanner";

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
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-5xl mx-auto">
        <PromotionBanner />
        <div className="w-full">
          <StatsSection />
          <DealsSection 
            selectedCategory={selectedCategory} 
            selectedCity={selectedCity} 
          />
        </div>
      </div>
    </div>
  );
}

export const MainContent = memo(MainContentComponent);
