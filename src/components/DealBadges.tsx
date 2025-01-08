import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "./CategoryBadge";

interface DealBadgesProps {
  category?: string;
  discountPercentage?: number;
  isNew?: boolean;
  variant?: "default" | "outline";
  className?: string;
  showCategoryBadge?: boolean;
  showDiscountBadge?: boolean;
  showNewBadge?: boolean;
}

export function DealBadges({ 
  category, 
  discountPercentage, 
  isNew, 
  variant = "default",
  className = "",
  showCategoryBadge = true,
  showDiscountBadge = true,
  showNewBadge = true,
}: DealBadgesProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showCategoryBadge && category && (
        <CategoryBadge category={category} variant={variant} />
      )}
      {showDiscountBadge && discountPercentage && (
        <Badge 
          variant={variant} 
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0"
        >
          {discountPercentage}% RABATT
        </Badge>
      )}
      {showNewBadge && isNew && (
        <Badge 
          variant={variant} 
          className="bg-muted text-muted-foreground hover:bg-muted/90 border-0"
        >
          NYTT
        </Badge>
      )}
    </div>
  );
}