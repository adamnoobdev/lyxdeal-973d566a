
import { cn } from "@/lib/utils";
import { Star, StarHalf, StarOff } from "lucide-react";

export interface RatingProps {
  value: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

/**
 * Visar en stjärnbetygskomponent med valfritt antal stjärnor
 */
export function Rating({ 
  value, 
  maxStars = 5, 
  size = "md", 
  showValue = true,
  className 
}: RatingProps) {
  // Avrunda betyget till närmaste halva
  const roundedValue = Math.round(value * 2) / 2;
  
  // Skapar en array med maxStars platser
  const stars = Array.from({ length: maxStars });
  
  // Bestämmer storleken på stjärnorna
  const starSizeClass = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  }[size];
  
  // Textförstoringsklass baserat på storlek
  const textSizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl font-semibold",
  }[size];
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showValue && (
        <span className={cn("text-gray-800", textSizeClass)}>
          {roundedValue.toFixed(1)}
        </span>
      )}
      <div className="flex">
        {stars.map((_, index) => {
          const starValue = index + 1;
          
          if (roundedValue >= starValue) {
            // Full stjärna
            return (
              <Star 
                key={index}
                className={cn("text-yellow-400 fill-yellow-400", starSizeClass)}
              />
            );
          } else if (roundedValue + 0.5 >= starValue) {
            // Halv stjärna
            return (
              <StarHalf 
                key={index}
                className={cn("text-yellow-400 fill-yellow-400", starSizeClass)}
              />
            );
          } else {
            // Tom stjärna
            return (
              <StarOff
                key={index}
                className={cn("text-gray-300", starSizeClass)}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
