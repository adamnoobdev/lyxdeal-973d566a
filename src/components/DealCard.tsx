import { Link } from "react-router-dom";
import { DealBadges } from "./DealBadges";
import { PriceDisplay } from "./PriceDisplay";
import { differenceInDays } from "date-fns";

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
  category,
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
      <div className={`group relative overflow-hidden rounded-lg bg-white transition-all hover:shadow-lg ${
        featured ? 'aspect-[16/9]' : 'aspect-[3/4]'
      }`}>
        <div className="absolute inset-0">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="absolute right-3 top-3">
          <DealBadges
            discountPercentage={discountPercentage}
            isNew={isNew}
            showCategoryBadge={false}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <DealBadges
            category={category}
            showDiscountBadge={false}
            showNewBadge={false}
            variant="outline"
            className="mb-2"
          />
          
          <h3 className="mb-1 text-lg font-semibold text-white line-clamp-2">
            {title}
          </h3>
          
          <p className="mb-2 text-sm text-gray-200 line-clamp-2">
            {description}
          </p>

          <PriceDisplay
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            className="text-white"
          />
        </div>
      </div>
    </Link>
  );
};