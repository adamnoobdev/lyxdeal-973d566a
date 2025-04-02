
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
        <Badge className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 text-xs font-medium shadow-sm">
          Populärast
        </Badge>
      )}
      
      <CardHeader className="pb-1">
        <CardTitle className="text-xl font-bold text-primary">{title}</CardTitle>
        <CardDescription className="text-xs mt-1 text-muted-foreground">
          {dealCount === 1 
            ? "Perfekt för mindre salonger"
            : "Bäst för växande salonger"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pt-1 space-y-4">
        <div className="flex justify-start">
          <div className="flex border rounded-none overflow-hidden shadow-sm">
            <Button
              type="button"
              variant={billingType === "monthly" ? "default" : "outline"}
              className={`text-xs py-1 px-3 h-8 rounded-none ${billingType === "monthly" ? "bg-primary text-white" : ""}`}
              onClick={() => setBillingType("monthly")}
            >
              Månadsvis
            </Button>
            <Button
              type="button"
              variant={billingType === "yearly" ? "default" : "outline"}
              className={`text-xs py-1 px-3 h-8 rounded-none ${billingType === "yearly" ? "bg-primary text-white" : ""}`}
              onClick={() => setBillingType("yearly")}
            >
              Årsvis
            </Button>
          </div>
        </div>
        
        {billingType === "yearly" && (
          <div className="text-xs text-primary font-medium bg-secondary/20 p-1.5 inline-block">
            Spara {yearSavings} kr med årsbetalning!
          </div>
        )}
        
        <div className="text-center">
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">{price}</span>
            <span className="text-lg font-medium text-primary ml-1">kr</span>
            <span className="text-muted-foreground text-xs ml-2">
              {billingType === "monthly" ? "/mån" : "/år"}
            </span>
          </div>
        </div>
        
        <ul className="space-y-2 mt-2">
          <li className="flex items-start gap-2 text-xs">
            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="font-medium"><strong>{dealCount}</strong> {dealCount === 1 ? 'erbjudande' : 'erbjudanden'} åt gången</span>
          </li>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-xs">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          className={`w-full py-4 text-sm font-medium transition-all duration-200 rounded-none ${
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
