
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
    <div id="pricing-section" className="py-16 bg-white"> {/* Minskad padding */}
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8"> {/* Minskad margin */}
          <h2 className="text-2xl font-bold mb-3">Välj det paket som passar dig bäst</h2> {/* Minskad textstorlek och margin */}
          <p className="text-gray-600 max-w-2xl mx-auto text-sm"> {/* Minskad textstorlek */}
            Vi erbjuder flexibla paket för att passa alla typer av salonger och behov. 
            Välj mellan att betala månadsvis eller årsvis för att spara ännu mer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"> {/* Minskad gap */}
          <PricingCard {...basicPackage} />
          <PricingCard {...premiumPackage} />
        </div>
        
        <div className="text-center mt-8 text-xs text-gray-500"> {/* Minskad margin och textstorlek */}
          <p>Alla priser exklusive moms.</p>
        </div>
      </div>
    </div>
  );
};
