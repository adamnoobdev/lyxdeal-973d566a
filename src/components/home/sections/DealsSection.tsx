
import { memo } from "react";
import { CityDealsSection } from "./CityDealsSection";

interface DealsSectionProps {
  selectedCategory: string;
  selectedCity: string;
}

const DealsSectionComponent = ({
  selectedCategory,
  selectedCity
}: DealsSectionProps) => {
  return (
    <div className="space-y-6">
      <CityDealsSection selectedCategory={selectedCategory} selectedCity={selectedCity} />
    </div>
  );
};

export const DealsSection = memo(DealsSectionComponent);
