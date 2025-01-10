import { CategoryBadge } from "../CategoryBadge";

interface DealImageProps {
  imageUrl: string;
  title: string;
  discountPercentage: number;
  isNew: boolean;
}

export const DealImage = ({ imageUrl, title, discountPercentage, isNew }: DealImageProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="absolute right-3 top-3 flex gap-2">
        <span className="bg-gradient-to-r from-[#D946EF]/90 to-[#9b87f5]/90 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-lg backdrop-blur-sm">
          -{discountPercentage}%
        </span>
        {isNew && (
          <CategoryBadge
            category="NYTT"
            variant="default"
            className="bg-yellow-400/90 text-yellow-950 hover:bg-yellow-500 border-transparent shadow-lg backdrop-blur-sm"
          />
        )}
      </div>
    </div>
  );
};