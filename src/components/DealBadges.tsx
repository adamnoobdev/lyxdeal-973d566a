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
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0"
        >
          {discountPercentage}% RABATT
        </Badge>
      )}
      {showNewBadge && isNew && (
        <Badge 
          variant={variant} 
          className="bg-emerald-500/90 text-white border-0"
        >
          NYTT
        </Badge>
      )}
    </div>
  );
}