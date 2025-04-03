
import { MapPin } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatPrice } from "@/utils/deal/dealPriceUtils";

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
  requiresDiscountCode = true
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
    <div className="p-1.5 sm:p-2.5 flex flex-col flex-1"> 
      <h3 className="text-sm xs:text-base sm:text-base font-medium line-clamp-2 leading-tight mt-1">{title}</h3>
      
      <p className="text-xs xs:text-sm text-muted-foreground line-clamp-2 mt-1 leading-tight">{description}</p>
      
      <div className="flex items-center text-xs text-gray-500 mt-1.5 mb-2">
        <MapPin className="h-3 w-3 mr-0.5" /> {city}
      </div>
      
      <div className="mt-auto pt-1.5 border-t mt-1">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-bold text-base xs:text-lg text-foreground">
              {isFree ? "Gratis" : `${formatCurrency(discountedPrice)}`}
            </span>
            {originalPrice > 0 && (isFree || originalPrice !== discountedPrice) && (
              <div className="flex items-center gap-1 mt-0.5">
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
