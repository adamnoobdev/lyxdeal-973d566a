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
      p-6 rounded-lg border shadow-md flex flex-col h-full
      ${isPopular ? 'border-primary-300/30 bg-primary-50/30 ring-2 ring-primary-300/30' : 'border-gray-200/60'}
    `}>
      {isPopular && (
        <div className="mb-4 -mt-2 mx-auto">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold inline-block">
            Populärt val
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">Perfekt för {dealCount === 1 ? 'ett enstaka erbjudande' : 'flera erbjudanden'}</p>
      
      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{monthlyPrice}</span>
            <span className="text-gray-500 ml-1"> SEK/mån</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">
              Årspris: <span className="font-semibold">{yearlyPrice} SEK</span>
            </span>
            <span className="text-sm text-green-600 font-medium">
              Spara {yearSavings} SEK per år
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-6 flex-grow">
        <h4 className="font-medium mb-3 text-gray-700">Inkluderar:</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{dealCount} erbjudande{dealCount > 1 ? 'n' : ''}</span>
          </li>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-green-50 p-3 rounded-md border border-green-100/60 mb-6">
        <p className="text-sm text-green-800 font-medium text-center">
          Använd rabattkoden <span className="font-bold">provmanad</span> för en gratis provmånad!
        </p>
      </div>
      
      <div className="space-y-3 mt-auto">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 font-medium" 
          size={isMobile ? "default" : "lg"}
          onClick={() => handleSignupClick('monthly')}
        >
          Betala månadsvis
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => handleSignupClick('yearly')}
          className="w-full hover:bg-primary/5 hover:text-primary font-medium"
          size={isMobile ? "default" : "lg"}
        >
          Betala årsvis
        </Button>
      </div>
    </div>
  );
};
