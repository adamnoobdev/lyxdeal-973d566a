
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useState } from "react";
import { SubscriptionPlan } from "@/components/salon/subscription/types";

interface PricingCardProps extends SubscriptionPlan {
  onSelectPlan?: (planTitle: string, planType: "monthly" | "yearly", price: number) => void;
}

export const PricingCard = ({
  title,
  monthlyPrice,
  yearlyPrice,
  yearSavings,
  dealCount,
  features,
  isPopular,
  onSelectPlan
}: PricingCardProps) => {
  const [billingType, setBillingType] = useState<"monthly" | "yearly">("monthly");
  const price = billingType === "monthly" ? monthlyPrice : yearlyPrice;

  const handleSelect = () => {
    if (onSelectPlan) {
      onSelectPlan(title, billingType, price);
    }
  };

  return (
    <Card className={`relative flex flex-col ${isPopular ? 'border-primary shadow-md' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-2 -right-2 bg-primary text-white">
          Populärast
        </Badge>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">
          {dealCount === 1 
            ? "Perfekt för mindre salonger"
            : "Bäst för växande salonger"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex justify-center mb-4">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              type="button"
              variant={billingType === "monthly" ? "default" : "outline"}
              className={`text-xs py-1 h-auto rounded-none`}
              onClick={() => setBillingType("monthly")}
            >
              Månadsvis
            </Button>
            <Button
              type="button"
              variant={billingType === "yearly" ? "default" : "outline"}
              className={`text-xs py-1 h-auto rounded-none flex items-center gap-2`}
              onClick={() => setBillingType("yearly")}
            >
              Årsvis
              <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded">
                Spara {yearSavings} kr
              </span>
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <span className="text-3xl font-bold">{price} kr</span>
          <span className="text-gray-500 text-sm ml-1">
            {billingType === "monthly" ? "/mån" : "/år"}
          </span>
        </div>
        
        <ul className="space-y-2 mt-4">
          <li className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>{dealCount}</strong> {dealCount === 1 ? 'erbjudande' : 'erbjudanden'} åt gången</span>
          </li>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isPopular ? "default" : "outline"}
          onClick={handleSelect}
        >
          Välj {title}
        </Button>
      </CardFooter>
    </Card>
  );
};
