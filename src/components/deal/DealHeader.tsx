import { Star } from "lucide-react";
import { CategoryBadge } from "../CategoryBadge";

interface DealHeaderProps {
  title: string;
  category: string;
}

export const DealHeader = ({ title, category }: DealHeaderProps) => {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-200"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <CategoryBadge 
        category={category} 
        className="bg-primary-50 text-primary hover:bg-primary-100 transition-colors" 
      />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        
        <div className="flex items-center gap-2">
          {renderStars(4.5)}
          <span className="text-sm text-muted-foreground">
            (4.5 / 5)
          </span>
        </div>
      </div>
    </div>
  );
};