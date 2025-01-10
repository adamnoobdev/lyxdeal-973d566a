import { CategoryBadge } from "@/components/CategoryBadge";
import { PriceDisplay } from "@/components/PriceDisplay";

interface RegularDealContentProps {
  title: string;
  description: string;
  category: string;
  city: string;
  timeRemaining: string;
  originalPrice: number;
  discountedPrice: number;
  quantityLeft: number;
}

export const RegularDealContent = ({
  title,
  description,
  category,
  city,
  timeRemaining,
  originalPrice,
  discountedPrice,
  quantityLeft,
}: RegularDealContentProps) => {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <CategoryBadge 
          category={category}
          variant="default"
          className="bg-gradient-to-r from-[#D946EF]/40 to-[#9b87f5]/40 text-white font-semibold shadow-sm backdrop-blur-md"
        />
        <span className="text-sm text-muted-foreground">
          {timeRemaining}
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold leading-tight text-foreground line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {city}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {quantityLeft} kvar
          </span>
        </div>

        <PriceDisplay
          originalPrice={originalPrice}
          discountedPrice={discountedPrice}
        />
      </div>
    </div>
  );
};