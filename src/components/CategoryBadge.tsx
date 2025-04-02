
import { cn } from "@/lib/utils";
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
    <div 
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-sm",
        variant === "default" 
          ? "bg-primary text-white" 
          : "bg-white text-primary/90 border border-primary/20",
        "shadow-sm whitespace-nowrap w-fit", // Lägg till w-fit för att förhindra stretching
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children || (
        <>
          <span className="text-sm flex-shrink-0">{getCategoryEmoji(category)}</span>
          <span className="truncate">{category}</span>
        </>
      )}
    </div>
  );
}
