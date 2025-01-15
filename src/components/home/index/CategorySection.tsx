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
    <div className="space-y-8 animate-fade-up">
      <div className="bg-accent/5 rounded-xl p-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center text-primary">Kategorier</h2>
          <Categories 
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center text-primary">Städer</h2>
          <Cities 
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
          />
        </div>
      </div>
    </div>
  );
}