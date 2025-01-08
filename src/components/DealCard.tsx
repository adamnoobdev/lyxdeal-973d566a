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
            className="h-48 w-full object-cover"
          />
          <Badge className="absolute right-2 top-2 bg-secondary">
            {discountPercentage}% RABATT
          </Badge>
        </div>
        <div className="p-4 text-left">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{description}</p>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{timeRemaining}</span>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <Tag className="h-4 w-4 text-success" />
            <span className="text-sm line-through">{formatPrice(originalPrice)}</span>
            <span className="text-lg font-bold text-success">{formatPrice(discountedPrice)}</span>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90">
            Köp Nu
          </Button>
        </div>
      </Link>
    </Card>
  );
}