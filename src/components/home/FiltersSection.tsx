import { Categories } from "../Categories";
import { Cities } from "../Cities";

interface FiltersSectionProps {
  selectedCategory: string;
  selectedCity: string;
  onSelectCategory: (category: string) => void;
  onSelectCity: (city: string) => void;
}

export const FiltersSection = ({
  selectedCategory,
  selectedCity,
  onSelectCategory,
  onSelectCity,
}: FiltersSectionProps) => {
  return (
    <div className="space-y-8">
      <Categories 
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      <Cities 
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />
    </div>
  );
};