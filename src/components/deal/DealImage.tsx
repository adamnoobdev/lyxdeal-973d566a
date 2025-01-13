import { CategoryBadge } from "../CategoryBadge";
import { Star } from "lucide-react";
import { ResponsiveImage } from "../common/ResponsiveImage";

interface DealImageProps {
  imageUrl: string;
  title: string;
  isNew?: boolean;
}

export const DealImage = ({ imageUrl, title, isNew }: DealImageProps) => {
  return (
    <div className="relative overflow-hidden rounded-t-lg">
      <div className="aspect-[3/2] overflow-hidden bg-accent/10">
        <ResponsiveImage
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
        />
      </div>
      {isNew && (
        <div className="absolute left-3 top-3">
          <CategoryBadge category="NYTT">
            <Star className="mr-1 h-3.5 w-3.5" />
            Ny
          </CategoryBadge>
        </div>
      )}
    </div>
  );
};