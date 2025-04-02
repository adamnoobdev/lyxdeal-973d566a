
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
    <div id="comparison-section" className="py-16 bg-gray-50">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lyxdeal vs. Traditionell Annonsbyrå</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upptäck fördelarna med att använda Lyxdeal jämfört med traditionella annonsbyråer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <Card className="border-none shadow-md mb-8">
            <CardHeader className="bg-primary-50 pb-2">
              <CardTitle className="text-xl text-center">Jämförelse</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 gap-4 p-4 border-b bg-gray-50">
                <div className="font-semibold"></div>
                <div className="font-semibold text-center">Traditionell Annonsbyrå</div>
                <div className="font-semibold text-center text-primary">Lyxdeal</div>
              </div>

              {/* Comparison items */}
              {comparisonItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-3 gap-4 p-4 ${index < comparisonItems.length - 1 ? "border-b" : ""}`}
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
            </CardContent>
          </Card>

          <Card className="border-primary-100 bg-primary-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sammanfattning av fördelarna med Lyxdeal</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
