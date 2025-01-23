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
    <div className="relative overflow-hidden">
      <div className="aspect-[3/2] overflow-hidden bg-muted-50">
        <ResponsiveImage
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
        />
      </div>
      {isNew && (
        <div className="absolute left-2 top-2">
          <CategoryBadge category="NYTT" className="bg-white/90 text-primary-600 text-xs">
            <Star className="mr-1 h-3 w-3" />
            Ny
          </CategoryBadge>
        </div>
      )}
    </div>
  );
};