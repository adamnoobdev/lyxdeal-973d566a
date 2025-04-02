
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
    <Card className={`relative flex flex-col h-full ${isPopular ? 'border-primary shadow-lg' : 'border-muted-300'}`}>
      {isPopular && (
        <Badge className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm">
          Populärast
        </Badge>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
        <CardDescription className="text-sm mt-1 text-muted-foreground">
          {dealCount === 1 
            ? "Perfekt för mindre salonger"
            : "Bäst för växande salonger"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex justify-center mb-6">
          <div className="flex border rounded-full overflow-hidden shadow-sm">
            <Button
              type="button"
              variant={billingType === "monthly" ? "default" : "outline"}
              className={`text-xs py-1 px-4 h-9 rounded-full ${billingType === "monthly" ? "bg-primary text-white" : ""}`}
              onClick={() => setBillingType("monthly")}
            >
              Månadsvis
            </Button>
            <Button
              type="button"
              variant={billingType === "yearly" ? "default" : "outline"}
              className={`text-xs py-1 px-4 h-9 rounded-full flex items-center gap-2 ${billingType === "yearly" ? "bg-primary text-white" : ""}`}
              onClick={() => setBillingType("yearly")}
            >
              Årsvis
              <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded-full">
                Spara {yearSavings} kr
              </span>
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">{price}</span>
            <span className="text-xl font-medium text-primary ml-1">kr</span>
            <span className="text-muted-foreground text-sm ml-2">
              {billingType === "monthly" ? "/mån" : "/år"}
            </span>
          </div>
        </div>
        
        <ul className="space-y-3 mt-6">
          <li className="flex items-start gap-3 text-sm">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="font-medium"><strong>{dealCount}</strong> {dealCount === 1 ? 'erbjudande' : 'erbjudanden'} åt gången</span>
          </li>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          className={`w-full py-6 text-base font-medium transition-all duration-200 ${
            isPopular 
              ? "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg" 
              : "bg-white hover:bg-primary/10 text-primary border-2 border-primary"
          }`}
          onClick={handleSelect}
        >
          Välj {title}
        </Button>
      </CardFooter>
    </Card>
  );
};
