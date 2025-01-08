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
        return '✨';
    }
  };

  if (featured) {
    return (
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl rounded-xl">
        <Link to={`/product/${id}`}>
          <div className="relative">
            <img
              src={imageUrl}
              alt={title}
              className="h-[400px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="border-white text-white backdrop-blur-sm bg-white/10 text-sm py-1.5">
                    {getCategoryEmoji(category)} {category}
                  </Badge>
                  <Badge className="bg-primary text-primary-foreground font-semibold text-sm py-1.5">
                    {discountPercentage}% RABATT
                  </Badge>
                </div>
                <h3 className="mb-3 text-3xl font-bold tracking-tight">{title}</h3>
                <p className="mb-6 text-lg line-clamp-2 text-white/90 font-medium">
                  {description}
                </p>
                <div className="mb-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-lg text-white/90 font-medium">{timeRemaining}</span>
                </div>
                <div className="mb-6 flex items-center gap-3">
                  <Tag className="h-5 w-5 text-primary" />
                  <span className="text-lg line-through text-white/70">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(discountedPrice)}
                  </span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-lg font-semibold py-6">
                  Köp Nu
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl rounded-xl">
      <Link to={`/product/${id}`}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground font-semibold">
            {discountPercentage}% RABATT
          </Badge>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-3">
            <Badge variant="outline" className="w-fit text-sm py-1">
              {getCategoryEmoji(category)} {category}
            </Badge>
            <h3 className="text-xl font-bold tracking-tight line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
              {description}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{timeRemaining}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm line-through text-muted-foreground">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(discountedPrice)}
              </span>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 font-semibold py-5">
              Köp Nu
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}