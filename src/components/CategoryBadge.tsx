import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "outline";
  className?: string;
  children?: React.ReactNode;
}

export function CategoryBadge({ category, variant = "outline", className = "", children }: CategoryBadgeProps) {
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

  const baseClassName = "bg-gradient-to-r from-primary via-success to-secondary text-white font-semibold shadow-sm";

  return (
    <Badge 
      variant={variant} 
      className={`inline-flex items-center gap-1 ${baseClassName} ${className}`}
    >
      {children || (
        <>
          {category === "NYTT" ? (
            <Star className="h-3 w-3" />
          ) : (
            getCategoryEmoji(category)
          )} 
          {category}
        </>
      )}
    </Badge>
  );
}