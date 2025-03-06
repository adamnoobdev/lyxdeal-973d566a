
import { CategoryBadge } from "../CategoryBadge";
import { Clock, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface RegularDealContentProps {
  title: string;
  description: string;
  category: string;
  city: string;
  timeRemaining: string;
  originalPrice: number;
  discountedPrice: number;
  quantityLeft: number;
  id?: number;
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
  id,
}: RegularDealContentProps) => {
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <div className="p-2.5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-1.5 mb-2">
        <CategoryBadge category={category} className="text-[10px]" />
        <div className="flex items-center text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5 mr-0.5" />
          {timeRemaining}
        </div>
      </div>

      <div className="flex-grow flex flex-col min-h-[4.5rem]">
        <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-1">{title}</h3>
        <p className="text-[11px] text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 mt-auto">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold">
              {discountedPrice} kr
            </span>
            <span className="text-xs line-through text-muted-foreground">
              {originalPrice} kr
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {city} • {quantityLeft} kvar
          </p>
        </div>
        <span className="text-xs font-medium text-white bg-[#ea384c] px-2.5 py-1 rounded-full shadow-sm">
          -{discountPercentage}%
        </span>
      </div>
      
      {id && (
        <div className="w-full mt-3">
          <Link to={`/deal/${id}`} className="block w-full">
            <Button 
              size="sm" 
              className="w-full text-xs py-2 h-10"
              variant="default"
            >
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              Säkra deal
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
