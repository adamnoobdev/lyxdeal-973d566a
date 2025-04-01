
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
  return <CityDealsSection selectedCategory={selectedCategory} selectedCity={selectedCity} />;
};

export const DealsSection = memo(DealsSectionComponent);
