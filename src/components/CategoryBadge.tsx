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
      className={`!inline-flex !items-center !gap-0.5 !w-fit !min-w-0 !text-[10px] !leading-none !px-1.5 !py-0.5 whitespace-nowrap ${
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
            <Award className="!h-2.5 !w-2.5 !shrink-0 text-black" />
          ) : (
            <span className="!shrink-0">{getCategoryEmoji(category)}</span>
          )} 
          <span className="!truncate">{category}</span>
        </>
      )}
    </Badge>
  );
}