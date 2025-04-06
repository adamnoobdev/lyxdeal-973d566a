
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Rating } from "@/components/ui/rating";
import { Label } from "@/components/ui/label";

interface RatingSliderProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export const RatingSlider = ({ 
  rating, 
  onRatingChange,
  disabled = false 
}: RatingSliderProps) => {
  const handleSliderChange = (value: number[]) => {
    if (disabled) return;
    // Round to 1 decimal place for display
    const newRating = Math.round(value[0] * 10) / 10;
    onRatingChange(newRating);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="rating" className="font-medium">Betyg: {rating.toFixed(1)}</Label>
      
      <div className="py-6 px-2">
        <Slider
          defaultValue={[rating]}
          max={5}
          min={0}
          step={0.1}
          value={[rating]}
          onValueChange={handleSliderChange}
          disabled={disabled}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0.0</span>
          <span>1.0</span>
          <span>2.0</span>
          <span>3.0</span>
          <span>4.0</span>
          <span>5.0</span>
        </div>
      </div>
      
      <div className="mt-2">
        <Rating value={rating} size="lg" showValue={true} />
      </div>
    </div>
  );
};
