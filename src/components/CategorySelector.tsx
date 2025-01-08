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
}

export const CategorySelector = ({ onCategorySelect }: CategorySelectorProps) => {
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
            onClick={() => onCategorySelect(category.name)}
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