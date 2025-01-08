import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Tag } from "lucide-react";

interface DealCardProps {
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  category: string;
}

export function DealCard({
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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="h-48 w-full object-cover"
        />
        <Badge className="absolute right-2 top-2 bg-secondary">
          {discountPercentage}% OFF
        </Badge>
      </div>
      <div className="p-4">
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
          <span className="text-sm line-through">${originalPrice}</span>
          <span className="text-lg font-bold text-success">${discountedPrice}</span>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90">
          Get Deal
        </Button>
      </div>
    </Card>
  );
}