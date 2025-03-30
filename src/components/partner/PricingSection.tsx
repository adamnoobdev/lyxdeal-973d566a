
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
    <div className="py-20 bg-white">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Välj det paket som passar dig bäst</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vi erbjuder flexibla paket för att passa alla typer av salonger och behov. 
            Välj mellan att betala månadsvis eller årsvis för att spara ännu mer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard {...basicPackage} />
          <PricingCard {...premiumPackage} />
        </div>
        
        <div className="text-center mt-10 text-sm text-gray-500">
          <p>Alla priser exklusive moms. Bindningstid 3 månader vid månadspris, 12 månader vid årspris.</p>
        </div>
      </div>
    </div>
  );
};
