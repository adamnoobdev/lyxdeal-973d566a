import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const categories = [
  { name: "Laserhårborttagning", icon: "✨" },
  { name: "Fillers", icon: "💉" },
  { name: "Rynkbehandlingar", icon: "🔄" },
  { name: "Hudvård", icon: "🧴" },
  { name: "Hårvård", icon: "💇‍♀️" },
  { name: "Naglar", icon: "💅" },
  { name: "Massage", icon: "💆‍♀️" },
];

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

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant="ghost"
            className="w-full justify-start gap-3 h-10 font-medium"
            onClick={() => handleCategorySelect(category.name)}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
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
        className="w-56 p-2"
      >
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.name}
            onClick={() => handleCategorySelect(category.name)}
            className="flex items-center gap-3 py-2 px-3 cursor-pointer rounded-md"
          >
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};