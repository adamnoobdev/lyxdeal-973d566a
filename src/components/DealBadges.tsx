import { BadgePlus } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";

interface DealBadgesProps {
  category: string;
  discountPercentage: number;
  isNew: boolean;
  variant?: "default" | "outline";
  className?: string;
}

export const DealBadges = ({
  category,
  discountPercentage,
  isNew,
  variant = "outline",
  className = "",
}: DealBadgesProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <CategoryBadge 
        category={category} 
        variant={variant}
        className={variant === "outline" ? "" : "border-white text-white backdrop-blur-sm bg-white/10 shadow-sm"} 
      />
      <CategoryBadge 
        category={`${discountPercentage}% RABATT`} 
        variant="default" 
        className="bg-gradient-to-r from-[#D946EF]/40 to-[#9b87f5]/40 text-white font-semibold shadow-sm backdrop-blur-md bg-white/10" 
      />
      {isNew && (
        <div className="flex items-center gap-1 bg-emerald-500/40 text-white font-semibold shadow-sm backdrop-blur-md bg-white/10 px-2.5 py-0.5 rounded-full">
          <BadgePlus className="w-3 h-3" />
          <span>NYTT</span>
        </div>
      )}
    </div>
  );
};