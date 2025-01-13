import { CategoryBadge } from "../CategoryBadge";
import { Star } from "lucide-react";

interface DealImageProps {
  imageUrl: string;
  title: string;
  isNew: boolean;
}

export const DealImage = ({ imageUrl, title, isNew }: DealImageProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg";
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-[3/2] overflow-hidden bg-accent/10">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
      </div>
      <div className="absolute right-2 top-2 flex gap-1.5">
        {isNew && (
          <CategoryBadge
            category="NYTT"
            variant="default"
            className="bg-yellow-400 text-yellow-950 hover:bg-yellow-500 border-transparent shadow-sm"
          >
            <Star className="h-2.5 w-2.5" />
            NYTT
          </CategoryBadge>
        )}
      </div>
    </div>
  );
};