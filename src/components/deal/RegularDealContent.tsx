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
    <div className="p-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[56px]">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {description}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{city}</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{discountedPrice} kr</p>
              <p className="text-sm text-muted-foreground line-through">
                {originalPrice} kr
              </p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-muted-foreground">{timeRemaining}</p>
            <p className="text-xs text-muted-foreground">
              {quantityLeft} kvar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};