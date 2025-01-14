import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { CSSProperties } from "react";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "outline";
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

export function CategoryBadge({ 
  category, 
  variant = "outline", 
  className = "", 
  children,
  onClick,
  style
}: CategoryBadgeProps) {
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
      className={`inline-flex items-center gap-1 w-auto ${
        category === "NYTT" 
          ? "bg-primary-50 text-primary-700 hover:bg-primary-100 border-primary-200" 
          : variant === "default" 
            ? "bg-muted-50 text-muted-700 hover:bg-muted-100 border-muted-200"
            : "border-muted-200 text-muted-700 hover:bg-muted-50"
      } ${className}`}
      onClick={onClick}
      style={style}
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