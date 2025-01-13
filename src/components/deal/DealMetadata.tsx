import { MapPin, Clock, Tag } from "lucide-react";

interface DealMetadataProps {
  city: string;
  timeRemaining: string;
  quantityLeft: number;
}

export const DealMetadata = ({ city, timeRemaining, quantityLeft }: DealMetadataProps) => {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <span>{city}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <span>{timeRemaining}</span>
      </div>
      {quantityLeft > 0 && (
        <div className="flex items-center gap-2 text-success">
          <Tag className="h-4 w-4" />
          <span>{quantityLeft} kvar i lager</span>
        </div>
      )}
    </div>
  );
};