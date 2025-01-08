import { Button } from "@/components/ui/button";

const categories = [
  "Alla Erbjudanden",
  "Skönhet & Spa",
  "Restauranger",
  "Aktiviteter",
  "Resor",
  "Shopping",
];

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function Categories({ selectedCategory, onSelectCategory }: CategoriesProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className={selectedCategory === category ? "bg-primary" : ""}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}