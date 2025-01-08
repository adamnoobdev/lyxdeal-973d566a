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

  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hudvård':
        return '✨';
      case 'laserhårborttagning':
        return '⚡';
      case 'fillers':
        return '💉';
      case 'rynkbehandlingar':
        return '🔄';
      case 'naglar':
        return '💅';
      case 'massage':
        return '💆‍♀️';
      case 'hårvård':
        return '💇‍♀️';
      default:
        return '🎁';
    }
  };

  if (featured) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <Link to={`/product/${id}`}>
          <div className="relative">
            <img
              src={imageUrl}
              alt={title}
              className="h-[400px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-white text-white">
                    {getCategoryEmoji(category)} {category}
                  </Badge>
                  <Badge className="bg-secondary">
                    🏷️ {discountPercentage}% RABATT
                  </Badge>
                </div>
                <h3 className="mb-2 text-2xl font-semibold">{title}</h3>
                <p className="mb-4 text-lg line-clamp-2 text-white/90">
                  {description}
                </p>
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-white/90" />
                  <span className="text-lg text-white/90">⏳ {timeRemaining}</span>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-success" />
                  <span className="text-lg line-through text-white/90">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-2xl font-bold text-success">
                    {formatPrice(discountedPrice)}
                  </span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Köp Nu 🛍️
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

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
            🏷️ {discountPercentage}% RABATT
          </Badge>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className="w-fit">
              {getCategoryEmoji(category)} {category}
            </Badge>
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">⏳ {timeRemaining}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-success" />
              <span className="text-sm line-through text-muted-foreground">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-lg font-bold text-success">
                {formatPrice(discountedPrice)}
              </span>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Köp Nu 🛍️
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}