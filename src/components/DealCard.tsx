import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CategoryBadge } from "./CategoryBadge";
import { Clock, MapPin, Tag } from "lucide-react";

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
  quantity_left,
}: DealCardProps) => {
  const discountPercentage = Math.round(
    ((original_price - discounted_price) / original_price) * 100
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link to={`/deal/${id}`} className="block">
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={image_url}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="absolute right-2 top-2">
            <span className="bg-primary text-white text-sm font-medium px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <CategoryBadge 
              category={category} 
              className="mb-2"
            />
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{city}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{time_remaining}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm line-through text-muted-foreground">
                  {formatPrice(original_price)}
                </span>
                <span className="text-base font-bold">
                  {formatPrice(discounted_price)}
                </span>
              </div>
              {quantity_left > 0 && (
                <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">
                  {quantity_left} kvar
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export const DealCard = memo(DealCardComponent);