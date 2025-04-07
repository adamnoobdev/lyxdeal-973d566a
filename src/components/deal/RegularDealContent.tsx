
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
    <div className={compact ? "p-3 sm:p-4 flex flex-col flex-1" : "p-4 sm:p-5 flex flex-col flex-1"}> 
      <h3 className={compact ? "text-sm sm:text-base md:text-lg font-medium line-clamp-2 mb-1 sm:mb-1.5" : "text-base sm:text-lg md:text-xl font-medium line-clamp-2 mb-1.5 sm:mb-2"}>{title}</h3>
      
      <p className={compact ? "text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-2.5" : "text-sm sm:text-base text-muted-foreground line-clamp-2 mb-2.5 sm:mb-3"}>{description}</p>
      
      <div className={compact ? "flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2" : "flex items-center justify-between text-sm sm:text-base text-gray-500 mb-2.5 sm:mb-3"}>
        <div className="flex items-center">
          <MapPin className={compact ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"} /> {city}
        </div>
        {formattedRating > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <Star className={compact ? "h-3 w-3 text-yellow-500 fill-yellow-500" : "h-4 w-4 text-yellow-500 fill-yellow-500"} />
            <span>{formattedRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className={compact ? "mt-auto pt-2 sm:pt-3 border-t" : "mt-auto pt-3 sm:pt-4 border-t"}>
        <div className="flex items-end justify-between">
          <div>
            <span className={compact ? "font-bold text-base sm:text-lg text-foreground" : "font-bold text-lg sm:text-xl md:text-2xl text-foreground"}>
              {isFree ? "Gratis" : `${formatCurrency(discountedPrice)}`}
            </span>
            {originalPrice > 0 && (isFree || originalPrice !== discountedPrice) && (
              <div className={compact ? "flex items-center gap-1 mt-0.5 sm:mt-1" : "flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5"}>
                <span className="text-xs sm:text-sm line-through text-gray-500">
                  {formatCurrency(originalPrice)}
                </span>
                {!isFree && (
                  <span className="text-xs sm:text-sm px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            )}
          </div>
          
          {requiresDiscountCode && (
            <div className="flex flex-col text-right">
              <div className="text-xs sm:text-sm">
                <span className="text-emerald-600 font-medium">{quantityLeft} kvar</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{daysRemaining} dagar</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
