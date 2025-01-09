import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  hoverRating: number;
  onHover: (value: number) => void;
  onRate: (value: number) => void;
}

export const StarRating = ({
  rating,
  hoverRating,
  onHover,
  onRate,
}: StarRatingProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Betyg</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className="p-1 hover:scale-110 transition-transform"
            onMouseEnter={() => onHover(value)}
            onMouseLeave={() => onHover(0)}
            onClick={() => onRate(value)}
          >
            <Star
              className={`h-6 w-6 ${
                value <= (hoverRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};