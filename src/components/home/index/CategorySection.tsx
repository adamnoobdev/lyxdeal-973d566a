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
      <div className="bg-accent/5 rounded-xl p-6 space-y-6">
        <Categories 
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
        <div className="border-t border-accent/10 pt-6">
          <Cities 
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
          />
        </div>
      </div>
    </div>
  );
}