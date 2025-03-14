import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CATEGORIES } from "@/constants/app-constants";
import { 
  Sparkles, 
  Zap, 
  Syringe, 
  Repeat2, 
  Scissors, 
  Palmtree, 
  Heart 
} from "lucide-react";

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'laserhårborttagning': return <Zap className="w-4 h-4" />;
    case 'fillers': return <Syringe className="w-4 h-4" />;
    case 'rynkbehandlingar': return <Repeat2 className="w-4 h-4" />;
    case 'hudvård': return <Sparkles className="w-4 h-4" />;
    case 'hårvård': return <Scissors className="w-4 h-4" />;
    case 'naglar': return <Palmtree className="w-4 h-4" />;
    case 'massage': return <Heart className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

const CategoriesComponent = ({ selectedCategory, onSelectCategory }: CategoriesProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    const city = searchParams.get('city');
    
    if (category !== "Alla Erbjudanden") {
      const newParams = new URLSearchParams();
      newParams.set('category', category);
      if (city) {
        newParams.set('city', city);
      }
      navigate(`/search?${newParams.toString()}`);
    } else {
      const newParams = new URLSearchParams();
      if (city) {
        newParams.set('city', city);
      }
      navigate(`/search?${newParams.toString()}`);
    }
  };

  return (
    <div className="relative mb-6 -mx-4 md:mx-0">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-full gap-3 px-4 pb-4 justify-start md:justify-center">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryClick(category)}
              className={`
                group relative overflow-hidden min-w-[140px]
                ${selectedCategory === category 
                  ? "bg-primary hover:bg-primary/90 shadow-lg ring-2 ring-primary/50" 
                  : "hover:bg-primary/30 border-primary/30 hover:border-primary/50"}
                h-10 px-4 transition-all duration-300
                hover:shadow-md active:scale-95
              `}
            >
              <span className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <span className="font-medium">{category}</span>
              </span>
              {selectedCategory === category && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-gradient" />
              )}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
};

export const Categories = memo(CategoriesComponent);