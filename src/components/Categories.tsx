
import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CATEGORIES } from "@/constants/app-constants";
import { cn } from "@/lib/utils";

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const getCategoryEmoji = (category: string) => {
  switch (category.toLowerCase()) {
    case 'laserhårborttagning': return '⚡';
    case 'fillers': return '💉';
    case 'rynkbehandlingar': return '🔄';
    case 'hudvård': return '✨';
    case 'hårvård': return '💇‍♀️';
    case 'naglar': return '💅';
    case 'massage': return '💆‍♀️';
    case 'tandvård': return '🦷';
    case 'ögonfransar & bryn': return '👁️';
    case 'kroppsvård': return '🌸';
    case 'ansiktsbehandling': return '🧖‍♀️';
    case 'makeup': return '🎨';
    case 'spa': return '🌊';
    default: return '✨';
  }
};

const CategoriesComponent = ({ selectedCategory, onSelectCategory }: CategoriesProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSearchPage = window.location.pathname === "/search";

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
    <div className={`relative mb-6 ${isSearchPage ? 'mx-0' : '-mx-4 md:mx-0'}`}>
      {isSearchPage ? (
        // For search page: show all categories without ScrollArea
        <div className="flex flex-wrap gap-2 px-4 pb-4 justify-center">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 text-xs font-medium",
                "shadow-sm hover:shadow-md active:scale-95",
                selectedCategory === category 
                  ? "bg-primary text-white border-transparent"
                  : "bg-white text-primary/90 border border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              <span className="text-xs">{getCategoryEmoji(category)}</span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      ) : (
        // For other pages: keep using the ScrollArea
        <div className="flex w-full gap-2 px-4 pb-4 justify-start md:justify-center overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 text-xs font-medium",
                "shadow-sm hover:shadow-md active:scale-95",
                selectedCategory === category 
                  ? "bg-primary text-white border-transparent"
                  : "bg-white text-primary/90 border border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              <span className="text-xs">{getCategoryEmoji(category)}</span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Categories = memo(CategoriesComponent);
