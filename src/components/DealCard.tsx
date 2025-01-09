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
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
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
  imageUrl,
  originalPrice,
  discountedPrice,
  timeRemaining,
  category,
  city,
  featured = false,
  created_at,
  quantityLeft,
}: DealCardProps) => {
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
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
        <Link to={`/deal/${id}`} className="block relative">
          <div className="relative h-[350px] sm:h-[400px] md:h-[450px]">
            <img
              src={imageUrl}
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
              timeRemaining={timeRemaining}
              originalPrice={originalPrice}
              discountedPrice={discountedPrice}
              quantityLeft={quantityLeft}
            />
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link to={`/deal/${id}`}>
        <DealImage
          imageUrl={imageUrl}
          title={title}
          discountPercentage={discountPercentage}
          isNew={isNew()}
        />
        <RegularDealContent
          title={title}
          description={description}
          category={category}
          city={city}
          timeRemaining={timeRemaining}
          originalPrice={originalPrice}
          discountedPrice={discountedPrice}
          quantityLeft={quantityLeft}
        />
      </Link>
    </Card>
  );
};

export const DealCard = memo(DealCardComponent);