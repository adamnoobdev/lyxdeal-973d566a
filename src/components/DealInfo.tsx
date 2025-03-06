
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { PriceDisplay } from "./PriceDisplay";

interface DealInfoProps {
  id: number;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  city: string;
  quantityLeft: number;
  salon?: {
    name: string;
    address: string | null;
    phone: string | null;
  } | null;
}

export const DealInfo = ({
  title,
  originalPrice,
  discountedPrice,
  timeRemaining,
  quantityLeft,
  salon,
}: DealInfoProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <PriceDisplay 
              originalPrice={originalPrice} 
              discountedPrice={discountedPrice}
              className="text-lg"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{quantityLeft} köp kvar till detta pris</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>{timeRemaining} kvar av kampanjen</span>
            </div>
          </div>
        </div>
        
        {salon && salon.phone && (
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 group"
            size="lg"
            onClick={() => window.location.href = `tel:${salon.phone}`}
          >
            <Phone className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            Kontakta salongen
          </Button>
        )}

        <p className="text-xs text-center text-gray-500">
          Besök salongens hemsida för att boka tid
        </p>
      </div>
    </div>
  );
};
