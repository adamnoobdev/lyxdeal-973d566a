import { CategoryBadge } from "../CategoryBadge";
import { Clock } from "lucide-react";

interface RegularDealContentProps {
  title: string;
  description: string;
  category: string;
  city: string;
  timeRemaining: string;
  originalPrice: number;
  discountedPrice: number;
  quantityLeft: number;
}

export const RegularDealContent = ({
  title,
  description,
  category,
  city,
  timeRemaining,
  originalPrice,
  discountedPrice,
  quantityLeft,
}: RegularDealContentProps) => {
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <CategoryBadge category={category} className="text-xs" />
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {timeRemaining}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold">
              {discountedPrice} kr
            </span>
            <span className="text-xs line-through text-muted-foreground">
              {originalPrice} kr
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {city} • {quantityLeft} kvar
          </p>
        </div>
        <span className="text-xs font-medium text-primary-600 bg-primary-50/50 px-2 py-1">
          -{discountPercentage}%
        </span>
      </div>
    </div>
  );
};