import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryBadge } from "./CategoryBadge";
import { PriceDisplay } from "./PriceDisplay";
import { memo } from "react";

interface DealCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  category: string;
  city: string;
  featured?: boolean;
}

export const DealCard = memo(({
  id,
  title,
  description,
  imageUrl,
  originalPrice,
  discountedPrice,
  timeRemaining,
  category,
  city,
  featured = false,
}: DealCardProps) => {
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  if (featured) {
    return (
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
        <Link to={`/product/${id}`} className="block">
          <div className="relative h-[300px] sm:h-[400px]">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <CategoryBadge 
                    category={category} 
                    variant="outline" 
                    className="border-white text-white backdrop-blur-sm bg-white/10 shadow-sm" 
                  />
                  <CategoryBadge 
                    category={`${discountPercentage}% RABATT`} 
                    variant="default" 
                    className="bg-primary text-white shadow-sm" 
                  />
                </div>
                <h3 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-white line-clamp-2">
                  {title}
                </h3>
                <p className="mb-4 text-sm sm:text-base line-clamp-2 text-white/90">
                  {description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm sm:text-base text-white/90">{city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm sm:text-base text-white/90">{timeRemaining}</span>
                  </div>
                  <PriceDisplay 
                    originalPrice={originalPrice}
                    discountedPrice={discountedPrice}
                    className="text-white"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
                  Köp Nu
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/product/${id}`}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <CategoryBadge 
            category={`${discountPercentage}% RABATT`} 
            variant="default"
            className="absolute right-3 top-3 bg-primary text-white shadow-sm"
          />
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-3">
            <CategoryBadge category={category} className="shadow-sm" />
            <h3 className="text-lg font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm">{city}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm">{timeRemaining}</span>
            </div>
            <PriceDisplay 
              originalPrice={originalPrice}
              discountedPrice={discountedPrice}
            />
            <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md transition-all duration-300 hover:shadow-lg">
              Köp Nu
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
});

DealCard.displayName = "DealCard";