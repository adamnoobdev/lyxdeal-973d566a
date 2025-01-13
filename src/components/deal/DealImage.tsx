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
      <div className="aspect-[3/2] overflow-hidden bg-accent/5">
        <ResponsiveImage
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
      {isNew && (
        <div className="absolute left-2.5 top-2.5">
          <CategoryBadge 
            category="NYTT"
            className="bg-primary/90 text-white hover:bg-primary shadow-sm"
          >
            <Star className="mr-0.5 h-3 w-3" />
            Ny
          </CategoryBadge>
        </div>
      )}
    </div>
  );
};