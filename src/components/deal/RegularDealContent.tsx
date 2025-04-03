
import { MapPin } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";

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
    <div className="p-2 flex flex-col flex-1"> {/* Minskad padding från p-3 till p-2 */}
      <div className="flex items-start justify-between gap-1 mb-1">
        <div className="flex flex-col items-start">
          <CategoryBadge category={category} className="text-[10px] px-1 py-0.5" /> {/* Minskad storlek på badge */}
          <h3 className="text-xs font-medium line-clamp-2 mt-1 mb-0.5">{title}</h3> {/* Mindre text och margin */}
        </div>
      </div>
      
      <p className="text-[10px] text-muted-foreground line-clamp-2 mb-1">{description}</p> {/* Minskad textstorlek */}
      
      <div className="flex items-center text-[10px] text-gray-500 mb-1">
        <MapPin className="h-2.5 w-2.5 mr-0.5" /> {city}
      </div>
      
      <div className="mt-auto pt-1 border-t"> {/* Minskad padding-top */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-bold text-xs text-foreground">
              {isFree ? "Gratis" : `${formatCurrency(discountedPrice)}`}
            </span>
            {originalPrice > 0 && (isFree || originalPrice !== discountedPrice) && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] line-through text-gray-500">
                  {formatCurrency(originalPrice)}
                </span>
                {!isFree && (
                  <span className="text-[10px] px-0.5 py-px bg-red-100 text-red-700 rounded">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            )}
          </div>
          
          {requiresDiscountCode && (
            <div className="flex flex-col text-right">
              <div className="text-[10px]">
                <span className="text-emerald-600 font-medium">{quantityLeft} kvar</span>
              </div>
              <div className="text-[10px] text-gray-500">{daysRemaining} dagar</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
