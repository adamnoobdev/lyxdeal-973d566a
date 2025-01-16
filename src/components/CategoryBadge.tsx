import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
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
      className={`inline-flex items-center gap-1 w-auto text-xs md:text-sm px-2 py-0.5 md:px-2.5 md:py-1 ${
        category === "NYTT" 
          ? "bg-amber-100 hover:bg-amber-200 text-black border-transparent" 
          : variant === "default" 
            ? "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent"
            : "border-primary/20 text-primary hover:bg-primary/10"
      } ${className}`}
      onClick={onClick}
      style={style}
    >
      {children || (
        <>
          {category === "NYTT" ? (
            <Award className="h-3 w-3 text-black" />
          ) : (
            getCategoryEmoji(category)
          )} 
          {category}
        </>
      )}
    </Badge>
  );
}