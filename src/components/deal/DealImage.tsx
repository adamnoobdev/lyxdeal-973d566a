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
        <CategoryBadge 
          category={`${discountPercentage}% RABATT`} 
          variant="default"
          className="bg-gradient-to-r from-[#D946EF]/40 to-[#9b87f5]/40 text-white font-semibold shadow-sm backdrop-blur-md bg-white/10 transition-all duration-300 hover:shadow-lg"
        />
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