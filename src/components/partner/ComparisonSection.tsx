
import { Check, X } from "lucide-react";

export const ComparisonSection = () => {
  // Define comparison items with traditional agency vs Lyxdeal
  const comparisonItems = [
    {
      title: "Kundkontakt",
      agency: "Salongen måste ringa och jaga kunder som sällan svarar",
      lyxdeal: "Rabattkoder skickas automatiskt till kunder som gör bokningen själva",
      lyxdealBetter: true,
    },
    {
      title: "Kostnad",
      agency: "Ca 10 000 kr/mån (7 000 kr annonsbudget + 3 000 kr arvode)",
      lyxdeal: "Endast 399 kr/mån, ingen extra annonsbudget krävs",
      lyxdealBetter: true,
    },
    {
      title: "Kvalitet på leads",
      agency: "Dåliga och okvalificerade leads",
      lyxdeal: "Besökare som är genuint intresserade av skönhetsbehandlingar",
      lyxdealBetter: true,
    },
  ];

  return (
    <div id="comparison-section" className="py-16 bg-white">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lyxdeal vs. Traditionell Annonsbyrå</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upptäck fördelarna med att använda Lyxdeal jämfört med traditionella annonsbyråer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <div className="min-w-full">
            {/* Table header */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="font-semibold text-lg"></div>
              <div className="font-semibold text-lg text-center p-2 bg-gray-100 rounded-t-lg">Traditionell Annonsbyrå</div>
              <div className="font-semibold text-lg text-center p-2 bg-primary-50 rounded-t-lg text-primary">Lyxdeal</div>
            </div>

            {/* Comparison items */}
            {comparisonItems.map((item, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 gap-4 ${index < comparisonItems.length - 1 ? "border-b pb-6 mb-6" : ""}`}
              >
                <div className="font-medium">{item.title}</div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 flex-shrink-0">
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-gray-600">{item.agency}</p>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-primary-700">{item.lyxdeal}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary-50 rounded-lg shadow-sm border border-primary-100">
            <h3 className="text-lg font-semibold mb-4 text-primary-900">Sammanfattning av fördelarna med Lyxdeal</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Automatiserad kundkontakt och bokningsprocess</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Betydligt lägre kostnad utan dolda avgifter</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Riktad marknadsföring till intresserade kunder</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Ingen annonsbudget krävs - vi driver trafiken till er</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
