import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { CSSProperties } from "react";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "outline";
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: CSSProperties;  // Add this line to support style prop
}

export function CategoryBadge({ 
  category, 
  variant = "outline", 
  className = "", 
  children,
  onClick,
  style  // Add this line
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
          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 hover:from-yellow-500 hover:to-yellow-600 border-transparent" 
          : variant === "default" 
            ? "bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white border-transparent"
            : "border-primary/20 text-primary hover:bg-primary/10"
      } ${className}`}
      onClick={onClick}
      style={style}  // Add this line
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