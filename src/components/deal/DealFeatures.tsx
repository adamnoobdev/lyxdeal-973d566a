import { Check, Clock, Sparkles, Tag } from "lucide-react";

interface DealFeaturesProps {
  discountPercentage: number;
  timeRemaining: string;
  quantityLeft: number;
}

export const DealFeatures = ({ discountPercentage, timeRemaining, quantityLeft }: DealFeaturesProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up">
      <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary-50/50 to-primary-100/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary-100 p-2.5 transition-colors group-hover:bg-primary-200">
            <Tag className="h-5 w-5 text-primary-700" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Spara {discountPercentage}%</h3>
            <p className="text-sm text-muted-foreground">
              Ett exklusivt erbjudande med stor besparing
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-secondary-50/50 to-secondary-100/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-secondary-100 p-2.5 transition-colors group-hover:bg-secondary-200">
            <Clock className="h-5 w-5 text-secondary-700" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Tidsbegränsat</h3>
            <p className="text-sm text-muted-foreground">
              {timeRemaining} kvar att boka
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-success-50/50 to-success-100/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-success-100 p-2.5 transition-colors group-hover:bg-success-200">
            <Sparkles className="h-5 w-5 text-success-700" />
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