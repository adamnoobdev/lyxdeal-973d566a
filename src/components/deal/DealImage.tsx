import { CategoryBadge } from "../CategoryBadge";

interface DealImageProps {
  imageUrl: string;
  title: string;
  discountPercentage: number;
  isNew: boolean;
}

export const DealImage = ({ imageUrl, title, discountPercentage, isNew }: DealImageProps) => {
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={title}
        className="h-52 w-full object-cover rounded-t-lg transition-all duration-500 ease-in-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute right-3 top-3 flex gap-2">
        <span className="bg-[#ea384c] text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
          -{discountPercentage}%
        </span>
        {isNew && (
          <CategoryBadge
            category="NYTT"
            variant="default"
            className="bg-yellow-400 text-yellow-950 hover:bg-yellow-500 border-transparent shadow-sm"
          />
        )}
      </div>
    </div>
  );
};