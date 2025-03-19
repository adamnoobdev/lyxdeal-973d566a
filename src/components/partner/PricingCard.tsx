
import { Check } from "lucide-react";
import { Button } from "../ui/button";

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
  const handleContactClick = () => {
    // Navigera till kontaktformuläret längre ner på sidan
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`
      p-6 rounded-lg border shadow-md flex flex-col h-full
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
      <p className="text-sm text-gray-500 mb-6">Perfekt för {dealCount === 1 ? 'ett enstaka erbjudande' : 'flera erbjudanden'}</p>
      
      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-3xl font-bold">{monthlyPrice}</span>
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
      
      <div className="mb-6 flex-grow">
        <h4 className="font-medium mb-2">Inkluderar:</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary" />
            <span>{dealCount} erbjudande{dealCount > 1 ? 'n' : ''}</span>
          </li>
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-2 mt-auto">
        <Button className="w-full" variant="default" onClick={handleContactClick}>
          Betala månadsvis
        </Button>
        <Button className="w-full" variant="outline" onClick={handleContactClick}>
          Betala årsvis
        </Button>
      </div>
    </div>
  );
};
