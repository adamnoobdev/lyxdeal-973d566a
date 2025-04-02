
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
    <div className="p-3 flex flex-col flex-1"> {/* Minskad padding från p-4 till p-3 */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex flex-col items-start">
          <CategoryBadge category={category} className="text-xs px-1.5 py-0.5" /> {/* Minskad storlek på badge */}
          <h3 className="text-sm font-medium line-clamp-2 mt-1.5 mb-1">{title}</h3> {/* Minskad textstorlek från text-base till text-sm */}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{description}</p> {/* Minskad textstorlek och margin */}
      
      <div className="flex items-center text-xs text-gray-500 mb-1">
        <MapPin className="h-3 w-3 mr-1" /> {city}
      </div>
      
      <div className="mt-auto pt-1.5 border-t"> {/* Minskad padding-top */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-bold text-sm text-foreground"> {/* Minskad textstorlek */}
              {isFree ? "Gratis" : `${formatCurrency(discountedPrice)}`}
            </span>
            {/* Ändrar villkoret så att vi visar originalpriset även för gratis erbjudanden så länge originalPrice > 0 */}
            {originalPrice > 0 && (isFree || originalPrice !== discountedPrice) && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs line-through text-gray-500">
                  {formatCurrency(originalPrice)}
                </span>
                {!isFree && (
                  <span className="text-xs px-1 py-0.5 bg-red-100 text-red-700 rounded">
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
