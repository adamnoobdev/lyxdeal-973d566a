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
        className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute right-3 top-3 flex gap-2">
        <CategoryBadge 
          category={`${discountPercentage}% RABATT`} 
          variant="default"
          className="bg-gradient-to-r from-[#D946EF]/40 to-[#9b87f5]/40 text-white font-semibold shadow-sm backdrop-blur-md bg-white/10"
        />
        {isNew && (
          <CategoryBadge
            category="NYTT"
            variant="default"
            className="bg-gradient-to-r from-yellow-300/60 via-yellow-400/60 to-yellow-500/60 text-yellow-950 font-semibold shadow-sm backdrop-blur-md bg-white/10"
          />
        )}
      </div>
    </div>
  );
};