
import { Button } from "@/components/ui/button";
import { Phone, Tag, ExternalLink } from "lucide-react";
import { PriceDisplay } from "@/components/PriceDisplay";
import { useNavigate } from "react-router-dom";

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
  booking_url?: string;
}

export const DealInfo = ({
  id,
  title,
  originalPrice,
  discountedPrice,
  daysRemaining,
  quantityLeft,
  salon,
  isFree,
  booking_url,
}: DealInfoProps) => {
  const navigate = useNavigate();
  
  // Format days remaining text
  const daysText = daysRemaining === 1 ? "dag" : "dagar";
  const timeRemainingText = `${daysRemaining} ${daysText} kvar`;

  // Handle securing the deal
  const handleSecureDeal = () => {
    navigate(`/secure-deal/${id}`);
  };

  // Handle booking
  const handleBooking = () => {
    if (booking_url) {
      window.open(booking_url, '_blank');
    }
  };

  console.log("DealInfo salon data:", salon);
  console.log("DealInfo booking_url:", booking_url);

  return (
    <div className="bg-white shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">{title}</h1>
        
        <div className="flex items-start justify-between">
          <PriceDisplay 
            originalPrice={originalPrice} 
            discountedPrice={discountedPrice}
            className="text-lg lg:text-xl"
            isFreeOverride={isFree}
            showSavedAmount={true}
            showDiscountBadge={true}
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>{quantityLeft} rabattkoder kvar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              <span>{timeRemainingText}</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white group"
          size="lg"
          onClick={handleSecureDeal}
        >
          <Tag className="mr-2 h-5 w-5" />
          Säkra rabattkod
        </Button>
        
        {salon && salon.phone && (
          <Button 
            variant="outline"
            className="w-full text-primary border border-primary hover:bg-primary/5 group mt-3"
            size="lg"
            onClick={() => window.location.href = `tel:${salon.phone}`}
          >
            <Phone className="mr-2 h-5 w-5" />
            Kontakta salongen
          </Button>
        )}

        {booking_url && (
          <Button 
            variant="outline"
            className="w-full text-primary border border-primary hover:bg-primary/5 group mt-3"
            size="lg"
            onClick={handleBooking}
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Boka tid
          </Button>
        )}

        <p className="text-xs text-center text-gray-500">
          {booking_url ? "Besök salongens hemsida för att boka tid" : "Säkra din rabattkod först"}
        </p>
      </div>
    </div>
  );
};
