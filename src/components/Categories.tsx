import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CATEGORIES } from "@/constants/app-constants";

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoriesComponent = ({ selectedCategory, onSelectCategory }: CategoriesProps) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    if (category !== "Alla Erbjudanden") {
      navigate(`/search?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="relative mb-6 -mx-4 md:mx-0">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-full gap-3 px-4 pb-2 justify-start md:justify-center">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryClick(category)}
              className={`
                ${selectedCategory === category ? "bg-primary shadow-md" : "hover:bg-accent"}
                flex-shrink-0 text-xs py-1.5 px-4 h-8 transition-all duration-300
                hover:shadow-md active:scale-95
              `}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
};

export const Categories = memo(CategoriesComponent);