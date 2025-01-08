import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
    <div className="relative mb-6 -mx-4 md:mx-0">
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-2 px-4 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => onSelectCategory(category)}
              className={`${
                selectedCategory === category ? "bg-primary" : ""
              } flex-shrink-0 text-xs py-2 px-4 h-8`}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}