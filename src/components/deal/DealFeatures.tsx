
import { Clock, Sparkles, Tag } from "lucide-react";

interface DealFeaturesProps {
  discountPercentage: number;
  timeRemaining: string;
  quantityLeft: number;
  savedAmount?: number;
}

export const DealFeatures = ({ 
  discountPercentage, 
  timeRemaining, 
  quantityLeft,
  savedAmount = 0
}: DealFeaturesProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary-50/50 to-primary-100/50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2">
            <Tag className="h-5 w-5 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Spara {discountPercentage}%</h3>
            <p className="text-sm text-muted-foreground">
              {savedAmount > 0 ? `Du sparar ${formatPrice(savedAmount)}` : 'Ett exklusivt erbjudande med stor besparing'}
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-secondary-50/50 to-secondary-100/50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-secondary p-2">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Tidsbegränsat</h3>
            <p className="text-sm text-muted-foreground">
              {timeRemaining} kvar att boka
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-success-50/50 to-success-100/50 p-6 shadow-sm sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-4">
          <div className="bg-success-500 p-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Garanterad kvalitet</h3>
            <p className="text-sm text-muted-foreground">
              Utvalda salonger med hög kundnöjdhet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
