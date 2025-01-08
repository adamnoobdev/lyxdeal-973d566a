import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "outline";
  className?: string;
}

export function CategoryBadge({ category, variant = "outline", className = "" }: CategoryBadgeProps) {
  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hudvård': return '✨';
      case 'laserhårborttagning': return '⚡';
      case 'fillers': return '💉';
      case 'rynkbehandlingar': return '🔄';
      case 'naglar': return '💅';
      case 'massage': return '💆‍♀️';
      case 'hårvård': return '💇‍♀️';
      default: return '✨';
    }
  };

  return (
    <Badge 
      variant={variant} 
      className={`inline-flex items-center gap-1 w-auto ${className}`}
    >
      {category === "NYTT" ? (
        <BadgeCheck className="h-3 w-3" />
      ) : (
        getCategoryEmoji(category)
      )} 
      {category}
    </Badge>
  );
}