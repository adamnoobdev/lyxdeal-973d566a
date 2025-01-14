import { memo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DealImage } from "./deal/DealImage";
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
  created_at: string;
  quantity_left: number;
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
  created_at,
  quantity_left,
}: DealCardProps) => {
  const isNew = useCallback(() => {
    const createdDate = new Date(created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }, [created_at]);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 bg-white/80 backdrop-blur-sm border-muted-200 hover:shadow-lg">
      <Link to={`/deal/${id}`} className="block">
        <div className="relative w-full h-full">
          <DealImage
            imageUrl={image_url}
            title={title}
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
            quantityLeft={quantity_left}
          />
        </div>
      </Link>
    </Card>
  );
};

export const DealCard = memo(DealCardComponent);