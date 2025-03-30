
import { Button } from "@/components/ui/button";
import { Phone, Tag, ExternalLink, MapPin } from "lucide-react";
import { PriceDisplay } from "@/components/PriceDisplay";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

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
  booking_url?: string | null;
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
  city
}: DealInfoProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Format days remaining text
  const daysText = daysRemaining === 1 ? "dag" : "dagar";
  const timeRemainingText = `${daysRemaining} ${daysText} kvar`;

  // Handle securing the deal
  const handleSecureDeal = () => {
    navigate(`/secure-deal/${id}`);
  };

  // Handle booking - open in new tab
  const handleBooking = () => {
    if (booking_url) {
      window.open(booking_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Bestäm vilket salongsnamn som ska visas - använd det från salongobjektet
  const displaySalonName = salon?.name || `Salong i ${city}`;
  const hasSalonAddress = !!salon?.address;
  const hasSalonPhone = !!salon?.phone;
  const hasBookingUrl = !!booking_url;

  return (
    <div className="bg-white shadow-sm p-4 md:p-6 space-y-5 md:rounded-lg">
      <div className="space-y-4">
        <h1 className={`${isMobile ? "text-lg" : "text-xl lg:text-2xl"} font-semibold text-gray-900`}>{title}</h1>
        
        {/* Location information with better mobile styling */}
        <div className="flex items-start text-sm text-gray-600 gap-2">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <span className="flex-1">{displaySalonName}{hasSalonAddress ? `, ${salon?.address}` : `, ${city}`}</span>
        </div>
        
        <div className="flex items-start justify-between">
          <PriceDisplay 
            originalPrice={originalPrice} 
            discountedPrice={discountedPrice}
            className={isMobile ? "text-base" : "text-lg lg:text-xl"}
            isFreeOverride={isFree}
            showSavedAmount={true}
            showDiscountBadge={true}
          />
        </div>

        {/* Availability information in a visually distinct box */}
        <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="space-y-2 text-sm text-gray-600">
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
        </div>
        
        {/* Button layout responsively adapts based on screen size */}
        <div className="space-y-3 pt-1">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
            size={isMobile ? "default" : "lg"}
            onClick={handleSecureDeal}
          >
            <Tag className="mr-2 h-5 w-5" />
            Säkra rabattkod
          </Button>
          
          <div className={`grid ${hasBookingUrl && hasSalonPhone ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-3`}>
            {hasSalonPhone && (
              <Button 
                variant="outline"
                className="w-full text-primary border border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                size={isMobile ? "default" : "lg"}
                onClick={() => window.location.href = `tel:${salon?.phone}`}
              >
                <Phone className="mr-2 h-5 w-5" />
                <span className="truncate">Kontakta</span>
              </Button>
            )}

            {hasBookingUrl && (
              <Button 
                variant="outline"
                className="w-full text-primary border border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                size={isMobile ? "default" : "lg"}
                onClick={handleBooking}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Boka tid
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 mt-1">
          {hasBookingUrl 
            ? "Besök salongens hemsida för att boka tid" 
            : "Säkra din rabattkod och kontakta salongen för bokning"}
        </p>
      </div>
    </div>
  );
};
