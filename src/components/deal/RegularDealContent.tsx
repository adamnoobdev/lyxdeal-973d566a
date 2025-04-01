
import { CategoryBadge } from "../CategoryBadge";
import { Clock, Tag, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface RegularDealContentProps {
  title: string;
  description: string;
  category: string;
  city: string;
  daysRemaining: number;
  originalPrice: number;
  discountedPrice: number;
  quantityLeft: number;
  isFree?: boolean;
  id?: number;
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
  isFree,
  id,
}: RegularDealContentProps) => {
  // Calculate discount percentage
  const discountPercentage = originalPrice > 0 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) 
    : 0;

  // Format days remaining text
  const daysText = daysRemaining === 1 ? "dag" : "dagar";
  const timeRemainingText = `${daysRemaining} ${daysText} kvar`;

  // Check if it's free (either explicitly set or price is 0)
  const isFreeDeal = isFree || discountedPrice === 0;

  // Calculate saved amount
  const savedAmount = originalPrice - discountedPrice;

  return (
    <div className="p-3 flex flex-col h-full justify-between">
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <CategoryBadge category={category} className="text-[10px]" />
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-0.5" />
          {timeRemainingText}
        </div>
      </div>

      <div className="mb-2">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
          {description}
        </p>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
        <MapPin className="h-3 w-3" />
        <span>{city}</span>
        <span className="mx-1">•</span>
        <span>{quantityLeft} kvar</span>
      </div>

      <div className="mt-auto">
        <div className="flex items-end justify-between mb-2">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-primary-600">
                {isFreeDeal ? "Gratis" : `${discountedPrice} kr`}
              </span>
              {originalPrice > discountedPrice && (
                <span className="text-xs line-through text-muted-foreground">
                  {originalPrice} kr
                </span>
              )}
            </div>
            {savedAmount > 0 && (
              <p className="text-xs text-[#ea384c] font-medium">
                Du sparar {savedAmount} kr
              </p>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-xs font-medium text-white bg-[#ea384c] px-1.5 py-0.5 shadow-sm">
              -{discountPercentage}%
            </span>
          )}
        </div>
        
        {id && (
          <Button 
            size="sm" 
            className="w-full text-xs h-8 font-medium shadow-sm"
            variant="default"
            asChild
          >
            <Link to={`/deal/${id}`}>
              <Tag className="h-3 w-3 mr-1.5" />
              Säkra rabattkod
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
