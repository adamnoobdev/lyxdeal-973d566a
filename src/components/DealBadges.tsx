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
          className="bg-primary text-primary-foreground hover:bg-primary/90 border-0"
        >
          {discountPercentage}% RABATT
        </Badge>
      )}
      {showNewBadge && isNew && (
        <Badge 
          variant={variant} 
          className="bg-[#FEF7CD] text-[#946800] hover:bg-[#FEF7CD]/90 border-0"
        >
          NYTT
        </Badge>
      )}
    </div>
  );
}