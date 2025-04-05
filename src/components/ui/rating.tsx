
import React from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Rating = ({ value, size = "md", className = "" }: RatingProps) => {
  // Determine star size based on prop
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= value ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
