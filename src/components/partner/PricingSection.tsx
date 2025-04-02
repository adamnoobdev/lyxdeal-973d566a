
import { PricingCard } from "./PricingCard";

export const PricingSection = () => {
  const basicPackage = {
    title: "Baspaket",
    monthlyPrice: 399,
    yearlyPrice: 2788,
    yearSavings: 2000,
    dealCount: 1,
    features: [
      "Synlighet på Lyxdeal.se",
      "Tillgång till administratörspanel",
      "Grundläggande statistik",
      "Kundhantering"
    ]
  };

  const premiumPackage = {
    title: "Premiumpaket",
    monthlyPrice: 699,
    yearlyPrice: 5388,
    yearSavings: 3000,
    dealCount: 3,
    features: [
      "Synlighet på Lyxdeal.se",
      "Tillgång till administratörspanel",
      "Detaljerad statistik",
      "Kundhantering",
      "Prioriterad placering",
      "Marknadsföringsstöd"
    ],
    isPopular: true
  };

  return (
    <div id="pricing-section" className="py-16 md:py-24 bg-gradient-to-b from-white to-secondary/5">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">Välj det paket som passar dig bäst</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Vi erbjuder flexibla paket för att passa alla typer av salonger och behov. 
            Välj mellan att betala månadsvis eller årsvis för att spara ännu mer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingCard {...basicPackage} />
          <PricingCard {...premiumPackage} />
        </div>
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Alla priser exklusive moms.</p>
        </div>
      </div>
    </div>
  );
};
