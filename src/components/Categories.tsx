import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  "Alla Erbjudanden",
  "Laserhårborttagning",
  "Fillers",
  "Rynkbehandlingar",
  "Hudvård",
  "Hårvård",
  "Naglar",
  "Massage",
];

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function Categories({ selectedCategory, onSelectCategory }: CategoriesProps) {
  return (
    <ScrollArea className="w-full pb-4">
      <div className="mb-8 flex gap-2 px-4 md:px-0">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onSelectCategory(category)}
            className={`${
              selectedCategory === category ? "bg-primary" : ""
            } whitespace-nowrap`}
          >
            {category}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}