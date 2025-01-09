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
      <img
        src={imageUrl}
        alt={title}
        className="h-52 w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 will-change-transform"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute right-3 top-3 flex gap-2 animate-fade-in">
        <span className="bg-[#ea384c] text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm backdrop-blur-sm">
          -{discountPercentage}%
        </span>
        {isNew && (
          <CategoryBadge
            category="NYTT"
            variant="default"
            className="bg-yellow-400 text-yellow-950 hover:bg-yellow-500 border-transparent transition-all duration-300 hover:shadow-lg"
          />
        )}
      </div>
    </div>
  );
};