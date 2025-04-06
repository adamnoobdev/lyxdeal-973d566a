
import { MapPin, Star } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatPrice } from "@/utils/deal/dealPriceUtils";
import { Rating } from "@/components/ui/rating";

interface RegularDealContentProps {
  title: string;
  description: string;
  category: string;
  city: string;
  originalPrice: number;
  discountedPrice: number;
  daysRemaining: number;
  quantityLeft: number;
  isFree?: boolean;
  id: number;
  requiresDiscountCode?: boolean;
  formattedRating?: number;
  compact?: boolean;
}

export const RegularDealContent = ({
  title,
  description,
  category,
  city,
  daysRemaining,
  originalPrice,
  discountedPrice,
  quantityLeft,
  isFree = false,
  id,
  requiresDiscountCode = true,
  formattedRating = 0,
  compact = true,
}: RegularDealContentProps) => {
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage =
    originalPrice > 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

  return (
    <div className={compact ? "p-1 flex flex-col flex-1" : "p-1.5 sm:p-2 flex flex-col flex-1"}> 
      <h3 className={compact ? "text-xs font-medium line-clamp-2 leading-tight" : "text-sm font-medium line-clamp-2 leading-tight mt-1"}>
        {title}
      </h3>
      
      <p className={compact ? "text-xs text-muted-foreground line-clamp-1 mt-0.5 leading-tight" : "text-xs text-muted-foreground line-clamp-2 mt-1 leading-tight"}>
        {description}
      </p>
      
      <div className={compact ? "flex items-center justify-between text-xs text-gray-500 mt-1 mb-0.5" : "flex items-center justify-between text-xs text-gray-500 mt-1.5 mb-1.5"}>
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-0.5" /> {city}
        </div>
        {formattedRating > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <Rating value={formattedRating} size="sm" />
          </div>
        )}
      </div>
      
      <div className={compact ? "mt-auto pt-1 border-t" : "mt-auto pt-1.5 border-t mt-1"}>
        <div className="flex items-end justify-between">
          <div>
            <span className={compact ? "font-bold text-xs xs:text-sm text-foreground" : "font-bold text-sm xs:text-base text-foreground"}>
              {isFree ? "Gratis" : `${formatCurrency(discountedPrice)}`}
            </span>
            {originalPrice > 0 && (isFree || originalPrice !== discountedPrice) && (
              <div className={compact ? "flex items-center gap-0.5 mt-0.5" : "flex items-center gap-1 mt-0.5"}>
                <span className="text-xs line-through text-gray-500">
                  {formatCurrency(originalPrice)}
                </span>
                {!isFree && (
                  <span className="text-xs px-0.5 py-px bg-red-100 text-red-700 rounded">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            )}
          </div>
          
          {requiresDiscountCode && (
            <div className="flex flex-col text-right">
              <div className="text-xs">
                <span className="text-emerald-600 font-medium">{quantityLeft} kvar</span>
              </div>
              <div className="text-xs text-gray-500">{daysRemaining} dagar</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
