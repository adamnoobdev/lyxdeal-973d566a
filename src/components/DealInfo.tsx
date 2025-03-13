
import { Button } from "@/components/ui/button";
import { Phone, Tag } from "lucide-react";
import { PriceDisplay } from "./PriceDisplay";

interface DealInfoProps {
  id: number;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  daysRemaining: number;
  city: string;
  quantityLeft: number;
  isFree?: boolean;
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
  daysRemaining,
  quantityLeft,
  isFree = false,
  salon,
}: DealInfoProps) => {
  // Format days remaining text
  const daysText = daysRemaining === 1 ? "dag" : "dagar";
  const timeRemainingText = `${daysRemaining} ${daysText} kvar`;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <PriceDisplay 
              originalPrice={originalPrice} 
              discountedPrice={discountedPrice}
              isFreeOverride={isFree}
              showZero={true} // Show 0 kr on the product page
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
              <span>{timeRemainingText}</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 group"
          size="lg"
        >
          <Tag className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          Säkra deal
        </Button>
        
        {salon && salon.phone && (
          <Button 
            className="w-full bg-white text-primary border border-primary hover:bg-primary/5 transition-all duration-200 group mt-3"
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
}
