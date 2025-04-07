
import { PricingCard } from "./PricingCard";
import { SUBSCRIPTION_PLANS } from "@/components/salon/subscription/types";

export const PricingSection = () => {
  return (
    <div id="pricing-section" className="py-8 md:py-12 bg-gradient-to-b from-white to-secondary/5">
      <div className="container px-3 md:px-4">
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-2 text-primary">Välj det paket som passar dig bäst</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm">
            Vi erbjuder flexibla paket för att passa alla typer av salonger och behov. 
            Välj mellan att betala månadsvis eller årsvis för att spara ännu mer.
          </p>
          <div className="mt-3 inline-block bg-primary/10 px-3 py-1.5 text-xs text-primary font-medium border-l-3 border-primary">
            Just nu: Använd rabattkod <span className="font-bold">provmanad</span> för en gratis provmånad!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <PricingCard {...SUBSCRIPTION_PLANS["Baspaket"]} />
          <PricingCard {...SUBSCRIPTION_PLANS["Premiumpaket"]} />
        </div>
        
        <div className="text-center mt-4 text-xs text-muted-foreground">
          <p>Alla priser exklusive moms.</p>
        </div>
      </div>
    </div>
  );
};
