import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface DealCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  category: string;
  featured?: boolean;
}

export function DealCard({
  id,
  title,
  description,
  imageUrl,
  originalPrice,
  discountedPrice,
  timeRemaining,
  category,
  featured = false,
}: DealCardProps) {
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/product/${id}`}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full object-cover ${featured ? 'h-[500px]' : 'h-48'}`}
          />
          <Badge className="absolute right-2 top-2 bg-secondary">
            {discountPercentage}% RABATT
          </Badge>
        </div>
        <div className="p-6 text-left">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
          <h3 className={`mb-2 font-semibold ${featured ? 'text-2xl' : 'text-lg'}`}>{title}</h3>
          <p className={`mb-4 text-gray-600 ${featured ? 'text-lg' : 'text-sm'} ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {description}
          </p>
          <div className="mb-4 flex items-center gap-2">
            <Clock className={`text-gray-500 ${featured ? 'h-5 w-5' : 'h-4 w-4'}`} />
            <span className={`text-gray-500 ${featured ? 'text-lg' : 'text-sm'}`}>{timeRemaining}</span>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <Tag className={`text-success ${featured ? 'h-5 w-5' : 'h-4 w-4'}`} />
            <span className={`line-through ${featured ? 'text-lg' : 'text-sm'}`}>{formatPrice(originalPrice)}</span>
            <span className={`font-bold text-success ${featured ? 'text-2xl' : 'text-lg'}`}>
              {formatPrice(discountedPrice)}
            </span>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90">
            Köp Nu
          </Button>
        </div>
      </Link>
    </Card>
  );
}