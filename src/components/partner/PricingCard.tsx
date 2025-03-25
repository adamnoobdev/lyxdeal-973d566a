
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

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

  const handleSignupClick = (paymentType: 'monthly' | 'yearly') => {
    const price = paymentType === 'monthly' ? monthlyPrice : yearlyPrice;
    
    // Navigate to signup page with plan information as query parameters
    navigate(`/partner/signup?plan=${encodeURIComponent(title)}&type=${paymentType}&price=${price}&deals=${dealCount}`);
  };

  return (
    <div className={`
      p-4 sm:p-6 rounded-lg border shadow-md flex flex-col h-full
      transition-all duration-300 hover:shadow-lg 
      ${isPopular ? 'border-primary bg-primary-50/30 ring-2 ring-primary' : 'border-gray-200'}
    `}>
      {isPopular && (
        <div className="mb-4 -mt-2 -mx-2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Populärt val
          </span>
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 sm:mb-6">Perfekt för {dealCount === 1 ? 'ett enstaka erbjudande' : 'flera erbjudanden'}</p>
      
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-2xl sm:text-3xl font-bold">{monthlyPrice}</span>
            <span className="text-gray-500"> SEK/mån</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">
              Årspris: <span className="font-semibold">{yearlyPrice} SEK</span>
            </span>
            <span className="text-sm text-success-700 font-medium">
              Spara {yearSavings} SEK per år
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-4 sm:mb-6 flex-grow">
        <h4 className="font-medium mb-2">Inkluderar:</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{dealCount} erbjudande{dealCount > 1 ? 'n' : ''}</span>
          </li>
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-green-50 p-3 rounded-md border border-green-200 mb-4">
        <p className="text-sm text-green-800 font-medium">
          Använd rabattkoden <span className="font-bold">provmanad</span> för en gratis provmånad!
        </p>
      </div>
      
      <div className="space-y-2 mt-auto">
        <Button 
          className="w-full" 
          variant="default" 
          onClick={() => handleSignupClick('monthly')}
        >
          Betala månadsvis
        </Button>
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={() => handleSignupClick('yearly')}
        >
          Betala årsvis
        </Button>
      </div>
    </div>
  );
};
