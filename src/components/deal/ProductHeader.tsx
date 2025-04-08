
import { CategoryBadge } from "../CategoryBadge";
import { Badge } from "../ui/badge";
import { MapPin } from "lucide-react";

interface ProductHeaderProps {
  category: string;
  city: string;
}

export const ProductHeader = ({ category, city }: ProductHeaderProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <CategoryBadge 
        category={category} 
      />
      <Badge variant="outline" className="flex items-center gap-1 text-xs rounded-none pl-1.5 pr-2.5 py-0.5">
        <MapPin className="h-3 w-3" />
        {city}
      </Badge>
    </div>
  );
};
