
import React from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  maxStars?: number;
  showValue?: boolean;
}

export const Rating = ({ 
  value, 
  size = "md", 
  className = "", 
  maxStars = 5,
  showValue = true 
}: RatingProps) => {
  // Format the numeric value correctly before display (handle values like 47 -> 4.7)
  const formattedValue = value > 10 ? value / 10 : value;
  
  // Determine star size based on prop
  const starSize = {
    sm: "h-3.5 w-3.5",
    md: "h-4.5 w-4.5",
    lg: "h-5.5 w-5.5"
  }[size];
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star className={`${starSize} text-yellow-500 fill-yellow-500`} />
      <span className={`text-${size === 'sm' ? 'sm' : 'base'} font-medium`}>
        {formattedValue.toFixed(1)}
      </span>
    </div>
  );
};
