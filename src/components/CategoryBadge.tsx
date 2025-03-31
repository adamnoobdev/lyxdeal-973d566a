
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
      case 'tandvård': return '🦷';
      case 'ögonfransar & bryn': return '👁️';
      case 'kroppsvård': return '🌸';
      case 'ansiktsbehandling': return '🧖‍♀️';
      case 'makeup': return '🎨';
      case 'spa': return '🌊';
      default: return '✨';
    }
  };

  return (
    <Badge 
      variant={variant} 
      className={`!inline-flex !items-center !gap-1 !w-fit !min-w-0 !text-xs !leading-none !px-2 !py-1 whitespace-nowrap ${
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
            <Award className="!h-3.5 !w-3.5 !shrink-0 text-black" />
          ) : (
            <span className="!shrink-0">{getCategoryEmoji(category)}</span>
          )} 
          <span className="!truncate">{category}</span>
        </>
      )}
    </Badge>
  );
}
