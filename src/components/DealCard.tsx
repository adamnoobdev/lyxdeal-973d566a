import { Link } from "react-router-dom";
import { DealBadges } from "./DealBadges";
import { PriceDisplay } from "./PriceDisplay";
import { differenceInDays } from "date-fns";
import { Button } from "./ui/button";
import { ShoppingCart, MapPin, Clock } from "lucide-react";

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
  created_at?: string;
}

export const DealCard = ({ 
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
  created_at,
}: DealCardProps) => {
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  const isNew = created_at ? 
    differenceInDays(new Date(), new Date(created_at)) <= 3 : 
    false;

  return (
    <Link to={`/product/${id}`}>
      <div className="group relative h-full overflow-hidden rounded-xl bg-white transition-all hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute right-3 top-3 z-10">
            <DealBadges
              discountPercentage={discountPercentage}
              isNew={isNew}
              showCategoryBadge={false}
            />
          </div>
        </div>

        <div className="flex h-[calc(100%-75%)] flex-col p-4">
          <DealBadges
            category={category}
            showDiscountBadge={false}
            showNewBadge={false}
            className="mb-2"
          />
          
          <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-2">
            {title}
          </h3>
          
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{city}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{timeRemaining}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <PriceDisplay
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
              />
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Köp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};