
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
    <div id="pricing-section" className="py-12 md:py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Välj det paket som passar dig bäst</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs md:text-sm">
            Vi erbjuder flexibla paket för att passa alla typer av salonger och behov. 
            Välj mellan att betala månadsvis eller årsvis för att spara ännu mer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          <PricingCard {...basicPackage} />
          <PricingCard {...premiumPackage} />
        </div>
        
        <div className="text-center mt-6 md:mt-8 text-xs text-gray-500">
          <p>Alla priser exklusive moms.</p>
        </div>
      </div>
    </div>
  );
};
