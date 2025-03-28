
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
    <div className="p-5 md:p-6 flex flex-col h-full justify-between">
      <div className="flex items-start justify-between gap-1 mb-3">
        <CategoryBadge category={category} className="text-xs" />
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {timeRemainingText}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium text-base md:text-lg leading-tight line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <MapPin className="h-3 w-3" />
        <span>{city}</span>
        <span className="mx-1">•</span>
        <span>{quantityLeft} kvar</span>
      </div>

      <div className="mt-auto">
        <div className="flex items-end justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary-600">
                {isFreeDeal ? "Gratis" : `${discountedPrice} kr`}
              </span>
              {originalPrice > discountedPrice && (
                <span className="text-sm line-through text-muted-foreground">
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
            <span className="text-xs font-medium text-white bg-[#ea384c] px-2 py-1 rounded-md shadow-sm">
              -{discountPercentage}%
            </span>
          )}
        </div>
        
        {id && (
          <Button 
            size="sm" 
            className="w-full text-sm h-10 font-medium shadow-sm"
            variant="default"
            asChild
          >
            <Link to={`/deal/${id}`}>
              <Tag className="h-4 w-4 mr-2" />
              Säkra rabattkod
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
