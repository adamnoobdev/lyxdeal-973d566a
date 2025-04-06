
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
  showValue = false 
}: RatingProps) => {
  // Format the numeric value correctly before display (handle values like 47 -> 4.7)
  const formattedValue = value > 10 ? value / 10 : value;
  
  // Determine star size based on prop
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];
  
  // Function to render stars with decimal precision
  const renderStars = () => {
    return Array.from({ length: maxStars }, (_, i) => {
      const starPosition = i + 1;
      const difference = formattedValue - i;
      
      // Full star
      if (difference >= 1) {
        return (
          <Star
            key={starPosition}
            className={`${starSize} text-yellow-500 fill-yellow-500`}
          />
        );
      } 
      // Partial star (using CSS for partial fill)
      else if (difference > 0 && difference < 1) {
        return (
          <div key={starPosition} className="relative">
            {/* Background star (empty) */}
            <Star className={`${starSize} text-gray-300`} />
            {/* Foreground star (filled) with width based on fill percentage */}
            <div 
              className="absolute top-0 left-0 overflow-hidden" 
              style={{ width: `${difference * 100}%` }}
            >
              <Star className={`${starSize} text-yellow-500 fill-yellow-500`} />
            </div>
          </div>
        );
      }
      // Empty star
      return (
        <Star
          key={starPosition}
          className={`${starSize} text-gray-300`}
        />
      );
    });
  };
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {renderStars()}
      {showValue && (
        <span className="text-sm font-medium ml-1">
          {formattedValue.toFixed(1)}
        </span>
      )}
    </div>
  );
};
