import { CategoryBadge } from "../CategoryBadge";
import { Star } from "lucide-react";

interface DealImageProps {
  imageUrl: string;
  title: string;
  isNew: boolean;
}

export const DealImage = ({ imageUrl, title, isNew }: DealImageProps) => {
  // Fallback image if the provided URL is invalid or image fails to load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg";
  };

  return (
    <div className="relative overflow-hidden rounded-t-lg">
      <div className="aspect-[4/3] overflow-hidden bg-accent/10">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
      </div>
      <div className="absolute right-3 top-3 flex gap-2">
        {isNew && (
          <CategoryBadge
            category="NYTT"
            variant="default"
            className="bg-gradient-to-r from-yellow-400/90 to-amber-500/90 text-yellow-950 hover:from-yellow-400 hover:to-amber-500 border-transparent shadow-lg backdrop-blur-sm ring-1 ring-white/10"
          >
            <Star className="h-3 w-3" />
            NYTT
          </CategoryBadge>
        )}
      </div>
    </div>
  );
};