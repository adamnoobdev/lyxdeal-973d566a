
import { PricingCard } from "./PricingCard";

export const PricingSection = () => {
  const basicPackage = {
    title: "Baspaket",
    monthlyPrice: 399,
    yearlyPrice: 2788,
    yearSavings: 2000,
    dealCount: 1,
    features: [
      "Kan köra ett erbjudande åt gången",
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
      "Kan köra tre erbjudanden samtidigt",
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
    <div id="pricing-section" className="py-12 md:py-16 bg-gradient-to-b from-white to-secondary/5">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-primary">Välj det paket som passar dig bäst</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Vi erbjuder flexibla paket för att passa alla typer av salonger och behov. 
            Välj mellan att betala månadsvis eller årsvis för att spara ännu mer.
          </p>
          <div className="mt-4 inline-block bg-primary/10 px-4 py-2 text-sm text-primary font-medium border-l-4 border-primary">
            Just nu: Använd rabattkod <span className="font-bold">provmanad</span> för en gratis provmånad!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <PricingCard {...basicPackage} />
          <PricingCard {...premiumPackage} />
        </div>
        
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>Alla priser exklusive moms.</p>
        </div>
      </div>
    </div>
  );
};
