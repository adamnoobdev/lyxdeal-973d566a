
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface PricingCardProps {
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearSavings: number;
  dealCount: number;
  features: string[];
  isPopular?: boolean;
}

export const PricingCard = ({
  title,
  monthlyPrice,
  yearlyPrice,
  yearSavings,
  dealCount,
  features,
  isPopular = false,
}: PricingCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignupClick = (paymentType: 'monthly' | 'yearly') => {
    const price = paymentType === 'monthly' ? monthlyPrice : yearlyPrice;
    
    // Navigate to signup page with plan information as query parameters
    navigate(`/partner/signup?plan=${encodeURIComponent(title)}&type=${paymentType}&price=${price}&deals=${dealCount}`);
  };

  return (
    <div className={`
      p-4 rounded-lg border shadow-md flex flex-col h-full
      ${isPopular ? 'border-primary-300/30 bg-primary-50/30 ring-2 ring-primary-300/30' : 'border-gray-200/60'}
    `}>
      {isPopular && (
        <div className="mb-3 -mt-2 mx-auto">
          <span className="bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-semibold inline-block">
            Populärt val
          </span>
        </div>
      )}
      
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-4">Perfekt för {dealCount === 1 ? 'ett enstaka erbjudande' : 'flera erbjudanden'}</p>
      
      <div className="mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{monthlyPrice}</span>
            <span className="text-gray-500 ml-1 text-sm"> SEK/mån</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs">
              Årspris: <span className="font-semibold">{yearlyPrice} SEK</span>
            </span>
            <span className="text-xs text-green-600 font-medium">
              Spara {yearSavings} SEK per år
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-4 flex-grow">
        <h4 className="font-medium mb-2 text-gray-700 text-sm">Inkluderar:</h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs">{dealCount} erbjudande{dealCount > 1 ? 'n' : ''}</span>
          </li>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-green-50 p-2 rounded-md border border-green-100/60 mb-4 text-center">
        <p className="text-xs text-green-800 font-medium">
          Använd rabattkoden <span className="font-bold">provmanad</span> för en gratis provmånad!
        </p>
      </div>
      
      <div className="space-y-2 mt-auto">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 font-medium text-xs py-1" 
          size={isMobile ? "sm" : "default"}
          onClick={() => handleSignupClick('monthly')}
        >
          Betala månadsvis
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => handleSignupClick('yearly')}
          className="w-full hover:bg-primary/5 hover:text-primary font-medium text-xs py-1"
          size={isMobile ? "sm" : "default"}
        >
          Betala årsvis
        </Button>
      </div>
    </div>
  );
};
