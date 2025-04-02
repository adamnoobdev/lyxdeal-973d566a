
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/constants/app-constants";

// Filter out "Alla Erbjudanden" for the selector
const categoryItems = CATEGORIES.filter(cat => cat !== "Alla Erbjudanden");

interface CategorySelectorProps {
  onCategorySelect: (category: string) => void;
  variant?: "desktop" | "mobile";
}

export const CategorySelector = ({ 
  onCategorySelect,
  variant = "desktop"
}: CategorySelectorProps) => {
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    onCategorySelect(category);
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

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

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1">
        {categoryItems.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className="w-full justify-start gap-3 h-10 font-medium"
            onClick={() => handleCategorySelect(category)}
          >
            <span className="text-sm">{getCategoryEmoji(category)}</span>
            <span>{category}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-sm font-medium hover:bg-accent"
        >
          Kategorier <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 p-2 max-h-[70vh] overflow-y-auto"
      >
        {categoryItems.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => handleCategorySelect(category)}
            className="flex items-center gap-3 py-2 px-3 cursor-pointer rounded-md"
          >
            <span className="text-sm">{getCategoryEmoji(category)}</span>
            <span className="font-medium">{category}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
