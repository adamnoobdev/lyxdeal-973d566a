import { CategoryBadge } from "../CategoryBadge";
import { Star } from "lucide-react";
import { useState } from "react";

interface DealImageProps {
  imageUrl: string;
  title: string;
  isNew: boolean;
}

export const DealImage = ({ imageUrl, title, isNew }: DealImageProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log('Image failed to load:', imageUrl);
    setImageError(true);
  };

  const getImageUrl = () => {
    if (imageError || !imageUrl) {
      return "/placeholder.svg";
    }
    
    // If it's a blob URL or already a full URL, return as is
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a relative path from Supabase storage, construct the full URL
    const { origin } = window.location;
    return `${origin}${imageUrl}`;
  };

  return (
    <div className="relative overflow-hidden rounded-t-lg">
      <div className="aspect-[3/2] overflow-hidden bg-accent/10">
        <img
          src={getImageUrl()}
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