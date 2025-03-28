
import { Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { CategoryBadge } from "../CategoryBadge";
import { PriceDisplay } from "../PriceDisplay";

interface FeaturedDealContentProps {
  title: string;
  description: string;
  category: string;
  discountPercentage: number;
  isNew: boolean;
  city: string;
  timeRemaining: string;
  originalPrice: number;
  discountedPrice: number;
  quantityLeft: number;
  isFree?: boolean;
}

export const FeaturedDealContent = ({
  title,
  description,
  category,
  discountPercentage,
  isNew,
  city,
  timeRemaining,
  originalPrice,
  discountedPrice,
  quantityLeft,
  isFree,
}: FeaturedDealContentProps) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 space-y-2 sm:space-y-4">
        <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <CategoryBadge 
            category={category} 
            variant="outline" 
            className="border-white/80 text-white backdrop-blur-sm bg-white/10 shadow-sm text-[10px] sm:text-sm py-0.5 px-2 sm:px-3" 
          />
          {isNew && (
            <CategoryBadge
              category="NYTT"
              variant="default"
              className="bg-yellow-400 text-yellow-950 border-transparent text-[10px] sm:text-sm py-0.5 px-2 sm:px-3"
            />
          )}
        </div>
        
        <h3 className="mb-1.5 sm:mb-3 text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white line-clamp-2">
          {title}
        </h3>
        
        <p className="mb-2 sm:mb-4 text-xs sm:text-base md:text-lg line-clamp-2 text-white/90">
          {description}
        </p>
        
        <div className="space-y-1.5 sm:space-y-3 mb-3 sm:mb-5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MapPin className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-base md:text-lg text-white/90">{city}</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-base md:text-lg text-white/90">{timeRemaining}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PriceDisplay 
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                className="text-white text-sm sm:text-lg md:text-xl"
                isFreeOverride={isFree}
              />
              {discountPercentage > 0 && (
                <span className="bg-[#ea384c] text-white text-[10px] sm:text-sm px-2 py-0.5 rounded-full font-semibold">
                  -{discountPercentage}%
                </span>
              )}
            </div>
            {quantityLeft > 0 && (
              <span className="text-xs sm:text-sm text-emerald-400">
                {quantityLeft} kvar
              </span>
            )}
          </div>
        </div>
        
        <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg text-xs sm:text-base md:text-lg py-2 sm:py-4 md:py-6">
          Köp Nu
        </Button>
      </div>
    </div>
  );
};
