import { memo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DealImage } from "./deal/DealImage";
import { FeaturedDealContent } from "./deal/FeaturedDealContent";
import { RegularDealContent } from "./deal/RegularDealContent";

interface DealCardProps {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  time_remaining: string;
  category: string;
  city: string;
  featured?: boolean;
  created_at: string;
  quantityLeft: number;
}

const DealCardComponent = ({
  id,
  title,
  description,
  image_url,
  original_price,
  discounted_price,
  time_remaining,
  category,
  city,
  featured = false,
  created_at,
  quantityLeft,
}: DealCardProps) => {
  const discountPercentage = Math.round(
    ((original_price - discounted_price) / original_price) * 100
  );

  const isNew = useCallback(() => {
    const createdDate = new Date(created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }, [created_at]);

  if (featured) {
    return (
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
        <Link to={`/product/${id}`} className="block relative">
          <div className="relative h-[350px] sm:h-[400px] md:h-[450px]">
            <img
              src={image_url}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              fetchPriority="high"
            />
            <FeaturedDealContent
              title={title}
              description={description}
              category={category}
              discountPercentage={discountPercentage}
              isNew={isNew()}
              city={city}
              timeRemaining={time_remaining}
              originalPrice={original_price}
              discountedPrice={discounted_price}
              quantityLeft={quantityLeft}
            />
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/product/${id}`}>
        <DealImage
          imageUrl={image_url}
          title={title}
          discountPercentage={discountPercentage}
          isNew={isNew()}
        />
        <RegularDealContent
          title={title}
          description={description}
          category={category}
          city={city}
          timeRemaining={time_remaining}
          originalPrice={original_price}
          discountedPrice={discounted_price}
          quantityLeft={quantityLeft}
        />
      </Link>
    </Card>
  );
};

export const DealCard = memo(DealCardComponent);