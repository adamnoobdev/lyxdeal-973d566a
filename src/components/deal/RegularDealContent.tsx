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
    <div className="p-2 space-y-1.5">
      <div className="flex items-start justify-between gap-1.5">
        <CategoryBadge category={category} className="text-[10px]" />
        <div className="flex items-center text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5 mr-0.5" />
          {timeRemaining}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-xs line-clamp-2">{title}</h3>
        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold">
              {discountedPrice} kr
            </span>
            <span className="text-[10px] line-through text-muted-foreground">
              {originalPrice} kr
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {city} • {quantityLeft} kvar
          </p>
        </div>
        <span className="text-[10px] font-medium text-primary-600 bg-primary-50/50 px-1.5 py-0.5">
          -{discountPercentage}%
        </span>
      </div>
    </div>
  );
};