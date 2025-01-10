import { Deal } from "@/types/deal";
import { FeaturedDealContent } from "./deal/FeaturedDealContent";
import { RegularDealContent } from "./deal/RegularDealContent";
import { DealImage } from "./deal/DealImage";
import { cn } from "@/lib/utils";

interface DealCardProps extends Deal {
  className?: string;
}

export function DealCard({ className, ...deal }: DealCardProps) {
  const {
    title,
    description,
    image_url,
    original_price,
    discounted_price,
    time_remaining,
    category,
    city,
    featured,
    quantity_left,
  } = deal;

  const discountPercentage = Math.round(
    ((original_price - discounted_price) / original_price) * 100
  );

  const isNew = new Date(deal.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className={cn("relative group overflow-hidden rounded-xl", className)}>
      <DealImage imageUrl={image_url} title={title} />
      {featured ? (
        <FeaturedDealContent
          title={title}
          description={description}
          category={category}
          discountPercentage={discountPercentage}
          isNew={isNew}
          city={city}
          timeRemaining={time_remaining}
          originalPrice={original_price}
          discountedPrice={discounted_price}
          quantityLeft={quantity_left}
        />
      ) : (
        <RegularDealContent
          title={title}
          description={description}
          category={category}
          discountPercentage={discountPercentage}
          isNew={isNew}
          city={city}
          timeRemaining={time_remaining}
          originalPrice={original_price}
          discountedPrice={discounted_price}
          quantityLeft={quantity_left}
        />
      )}
    </div>
  );
}