import { memo } from "react";
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
}: DealCardProps) => {
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  const isNew = () => {
    const createdDate = new Date(created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  if (featured) {
    return (
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
        <Link to={`/product/${id}`} className="block relative">
          <div className="relative h-[300px] sm:h-[400px]">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
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
        />
      </Link>
    </Card>
  );
};

export const DealCard = memo(DealCardComponent);