
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
      <div className="aspect-[16/11] overflow-hidden bg-muted-50">
        <ResponsiveImage
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
        />
      </div>
      {isNew && (
        <div className="absolute left-1.5 top-1.5">
          <CategoryBadge category="NYTT" className="bg-white/90 text-primary-600 text-[10px]">
            <Star className="mr-0.5 h-2.5 w-2.5" />
            Ny
          </CategoryBadge>
        </div>
      )}
    </div>
  );
};
