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
    <div className="relative overflow-hidden rounded-t-lg">
      <div className="aspect-[16/9] overflow-hidden bg-accent/10">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
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
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 hover:from-yellow-500 hover:to-yellow-600 border-transparent shadow-lg backdrop-blur-sm ring-1 ring-white/10 text-xs"
          >
            <Star className="h-2.5 w-2.5" />
            NYTT
          </CategoryBadge>
        )}
      </div>
    </div>
  );
};