
import { memo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DealImage } from "./deal/DealImage";
import { RegularDealContent } from "./deal/RegularDealContent";
import { CategoryBadge } from "./CategoryBadge";

interface DealCardProps {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  expiration_date?: string;
  category: string;
  city: string;
  created_at: string;
  quantity_left: number;
  is_free?: boolean;
  requires_discount_code?: boolean;
}

const DealCardComponent = ({
  id,
  title,
  description,
  image_url,
  original_price,
  discounted_price,
  expiration_date,
  category,
  city,
  created_at,
  quantity_left,
  is_free = false,
  requires_discount_code = true,
}: DealCardProps) => {
  const isNew = useCallback(() => {
    const createdDate = new Date(created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }, [created_at]);

  const calculateDaysRemaining = () => {
    if (!expiration_date) return 30;
    
    const expirationDate = new Date(expiration_date);
    const now = new Date();
    
    expirationDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <Card className="group h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] bg-white/95 border-muted-200 hover:border-primary/20">
      <Link to={`/deal/${id}`} className="block h-full flex flex-col touch-manipulation">
        <div className="flex flex-col h-full">
          <div className="w-full">
            <DealImage
              imageUrl={image_url}
              title={title}
              isNew={isNew()}
              className="h-36 xs:h-40 sm:h-44 md:h-48"
            />
            <div className="px-1.5 sm:px-3 mt-1.5">
              <CategoryBadge category={category} />
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <RegularDealContent
              title={title}
              description={description}
              category={category}
              city={city}
              daysRemaining={daysRemaining}
              originalPrice={original_price}
              discountedPrice={discounted_price}
              quantityLeft={quantity_left}
              isFree={is_free}
              id={id}
              requiresDiscountCode={requires_discount_code}
            />
          </div>
        </div>
      </Link>
    </Card>
  );
};

export const DealCard = memo(DealCardComponent);
