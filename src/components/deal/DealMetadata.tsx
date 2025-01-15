import { MapPin, Clock, Tag } from "lucide-react";

interface DealMetadataProps {
  city: string;
  timeRemaining: string;
  quantityLeft: number;
}

export const DealMetadata = ({ city, timeRemaining, quantityLeft }: DealMetadataProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary-50/50 to-primary-100/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="absolute inset-0 bg-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative flex items-center gap-4">
          <div className="rounded-full bg-primary-100 p-3 transition-colors group-hover:bg-primary-200">
            <MapPin className="h-5 w-5 text-primary-700" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Plats</h3>
            <p className="text-sm text-muted-foreground">
              {city}
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-secondary-50/50 to-secondary-100/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="absolute inset-0 bg-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative flex items-center gap-4">
          <div className="rounded-full bg-secondary-100 p-3 transition-colors group-hover:bg-secondary-200">
            <Clock className="h-5 w-5 text-secondary-700" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Tid kvar</h3>
            <p className="text-sm text-muted-foreground">
              {timeRemaining}
            </p>
          </div>
        </div>
      </div>

      {quantityLeft > 0 && (
        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-success-50/50 to-success-100/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
          <div className="absolute inset-0 bg-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-full bg-success-100 p-3 transition-colors group-hover:bg-success-200">
              <Tag className="h-5 w-5 text-success-700" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Antal kvar</h3>
              <p className="text-sm text-muted-foreground">
                {quantityLeft} erbjudanden tillgängliga
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};