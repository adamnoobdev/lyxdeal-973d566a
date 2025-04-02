
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
    <div id="comparison-section" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lyxdeal vs. Traditionell Annonsbyrå</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upptäck fördelarna med att använda Lyxdeal jämfört med traditionella annonsbyråer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Comparison table with modern styling - removed hover and transition animations */}
          <Card className="border-none shadow-lg overflow-hidden mb-10">
            <CardHeader className="bg-primary-50 border-b border-primary-100">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold text-primary-700"></div>
                <div className="font-semibold text-center text-gray-700">Traditionell Annonsbyrå</div>
                <div className="font-semibold text-center text-primary">Lyxdeal</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Comparison items - removed transition and hover effects */}
              {comparisonItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-3 gap-4 p-5 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } ${
                    index < comparisonItems.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="font-medium text-gray-800">{item.title}</div>
                  <div className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0 bg-red-100 rounded-full p-1">
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-gray-600">{item.agency}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0 bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-primary-700 font-medium">{item.lyxdeal}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary card - removed transition and hover effects */}
          <Card className="border-primary/10 bg-gradient-to-r from-primary-50/40 to-primary-50/20 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-primary-700">Sammanfattning av fördelarna med Lyxdeal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 flex-shrink-0 bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-gray-700">Automatiserad kundkontakt och bokningsprocess</span>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 flex-shrink-0 bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-gray-700">Betydligt lägre kostnad utan dolda avgifter</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 flex-shrink-0 bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-gray-700">Riktad marknadsföring till intresserade kunder</span>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 flex-shrink-0 bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-gray-700">Ingen annonsbudget krävs - vi driver trafiken till er</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
