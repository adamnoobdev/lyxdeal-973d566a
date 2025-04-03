
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
    <div className="p-2 sm:p-4 flex flex-col flex-1"> 
      <h3 className="text-xs xs:text-sm font-medium line-clamp-2 leading-snug mt-2 mb-2">{title}</h3>
      
      <p className="text-[10px] xs:text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">{description}</p>
      
      <div className="flex items-center text-[10px] xs:text-xs text-gray-500 mb-2">
        <MapPin className="h-3 w-3 mr-1" /> {city}
      </div>
      
      <div className="mt-auto pt-2 border-t mt-2">
        <div className="flex items-end justify-between mt-2">
          <div>
            <span className="font-bold text-base xs:text-lg text-foreground">
              {isFree ? "Gratis" : `${formatCurrency(discountedPrice)}`}
            </span>
            {originalPrice > 0 && (isFree || originalPrice !== discountedPrice) && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] xs:text-xs line-through text-gray-500">
                  {formatCurrency(originalPrice)}
                </span>
                {!isFree && (
                  <span className="text-[9px] xs:text-[10px] px-1 py-0.5 bg-red-100 text-red-700 rounded">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            )}
          </div>
          
          {requiresDiscountCode && (
            <div className="flex flex-col text-right">
              <div className="text-[10px] xs:text-xs">
                <span className="text-emerald-600 font-medium">{quantityLeft} kvar</span>
              </div>
              <div className="text-[10px] xs:text-xs text-gray-500 mt-0.5">{daysRemaining} dagar</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
