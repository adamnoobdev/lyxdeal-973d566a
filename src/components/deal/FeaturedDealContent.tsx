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
}: FeaturedDealContentProps) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent animate-fade-in">
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 space-y-2 sm:space-y-4">
        <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <CategoryBadge 
            category={category} 
            variant="outline" 
            className="border-white/80 text-white backdrop-blur-sm bg-white/10 shadow-sm text-[10px] sm:text-sm py-0.5 px-2 sm:px-3 transition-all duration-300 hover:bg-white/20" 
          />
          <CategoryBadge 
            category={`${discountPercentage}% RABATT`} 
            variant="default" 
            className="bg-gradient-to-r from-[#D946EF]/60 to-[#9b87f5]/60 text-white font-semibold shadow-sm backdrop-blur-md text-[10px] sm:text-sm py-0.5 px-2 sm:px-3 transition-all duration-300 hover:shadow-lg" 
          />
          {isNew && (
            <CategoryBadge
              category="NYTT"
              variant="default"
              className="bg-gradient-to-r from-yellow-300/60 via-yellow-400/60 to-yellow-500/60 text-yellow-950 font-semibold shadow-sm backdrop-blur-md text-[10px] sm:text-sm py-0.5 px-2 sm:px-3 transition-all duration-300 hover:shadow-lg"
            />
          )}
        </div>
        
        <h3 className="mb-1.5 sm:mb-3 text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white line-clamp-2 transition-colors duration-300 hover:text-primary/90">
          {title}
        </h3>
        
        <p className="mb-2 sm:mb-4 text-xs sm:text-base md:text-lg line-clamp-2 text-white/90">
          {description}
        </p>
        
        <div className="space-y-1.5 sm:space-y-3 mb-3 sm:mb-5">
          <div className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 hover:translate-x-1">
            <MapPin className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-base md:text-lg text-white/90">{city}</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 hover:translate-x-1">
            <Clock className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-base md:text-lg text-white/90">{timeRemaining}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <PriceDisplay 
              originalPrice={originalPrice}
              discountedPrice={discountedPrice}
              className="text-white text-sm sm:text-lg md:text-xl"
            />
            {quantityLeft > 0 && (
              <span className="text-xs sm:text-sm text-emerald-400 transition-all duration-300 hover:scale-105">
                {quantityLeft} kvar
              </span>
            )}
          </div>
        </div>
        
        <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-base md:text-lg py-2 sm:py-4 md:py-6">
          Köp Nu
        </Button>
      </div>
    </div>
  );
};