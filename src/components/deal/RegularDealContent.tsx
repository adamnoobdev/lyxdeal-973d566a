
import { CategoryBadge } from "../CategoryBadge";
import { Clock, Tag } from "lucide-react";
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
  quantityLeft,
  id,
}: RegularDealContentProps) => {
  // Alla erbjudanden är alltid gratis nu
  const isFreeDeal = true;
  
  // Alltid 100% rabatt
  const discountPercentage = 100;

  // Format days remaining text
  const daysText = daysRemaining === 1 ? "dag" : "dagar";
  const timeRemainingText = `${daysRemaining} ${daysText} kvar`;

  return (
    <div className="p-2 flex flex-col h-full justify-between">
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <CategoryBadge category={category} className="text-[10px]" />
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-0.5" />
          {timeRemainingText}
        </div>
      </div>

      <div className="mb-1.5">
        <h3 className="font-medium text-base leading-tight line-clamp-2 mb-0.5">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
          {description}
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1.5">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-semibold">
                GRATIS
              </span>
              {originalPrice > 0 && (
                <span className="text-sm line-through text-muted-foreground">
                  {originalPrice} kr
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {city} • {quantityLeft} kvar
            </p>
          </div>
          <span className="text-xs font-medium text-white bg-[#ea384c] px-2 py-0.5 rounded-full shadow-sm">
            -{discountPercentage}%
          </span>
        </div>
        
        {id && (
          <Button 
            size="sm" 
            className="w-full text-sm h-8"
            variant="default"
            asChild
          >
            <Link to={`/deal/${id}`}>
              <Tag className="h-3.5 w-3.5 mr-1" />
              Säkra deal
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
