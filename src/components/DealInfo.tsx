import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface DealInfoProps {
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  city: string;
}

export const DealInfo = ({
  title,
  description,
  category,
  originalPrice,
  discountedPrice,
  timeRemaining,
  city,
}: DealInfoProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Badge variant="outline" className="mb-2">
        {category}
      </Badge>
      
      <h1 className="text-3xl font-bold">{title}</h1>
      
      <div className="flex items-center gap-2">
        {renderStars(4.5)}
        <span className="text-sm text-gray-600">
          (4.5 / 5)
        </span>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg text-gray-600">{description}</p>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Ordinarie pris</p>
          <p className="text-lg line-through">{formatPrice(originalPrice)}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Ditt pris</p>
          <p className="text-3xl font-bold text-primary">
            {formatPrice(discountedPrice)}
          </p>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
          Köp Nu
        </Button>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>✓ Plats: {city}</p>
        <p>✓ Tid kvar: {timeRemaining}</p>
      </div>
    </div>
  );
};