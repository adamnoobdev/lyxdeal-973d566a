import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";

interface CategorySectionProps {
  selectedCategory: string;
  selectedCity: string;
  onSelectCategory: (category: string) => void;
  onSelectCity: (city: string) => void;
}

export function CategorySection({
  selectedCategory,
  selectedCity,
  onSelectCategory,
  onSelectCity,
}: CategorySectionProps) {
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
}