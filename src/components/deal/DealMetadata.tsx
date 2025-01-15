import { MapPin, Clock, Tag } from "lucide-react";

interface DealMetadataProps {
  city: string;
  timeRemaining: string;
  quantityLeft: number;
}

export const DealMetadata = ({ city, timeRemaining, quantityLeft }: DealMetadataProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/5 p-2">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Plats</p>
            <p className="text-sm text-muted-foreground">
              {city}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/5 p-2">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Tid kvar</p>
            <p className="text-sm text-muted-foreground">
              {timeRemaining}
            </p>
          </div>
        </div>
      </div>

      {quantityLeft > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/5 p-2">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Antal kvar</p>
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