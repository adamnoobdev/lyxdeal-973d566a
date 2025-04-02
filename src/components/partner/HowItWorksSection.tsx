
import { Check, ArrowRight } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <div id="how-it-works" className="py-16 bg-gray-50">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Hur fungerar det?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Det är enkelt att komma igång som salongspartner med Lyxdeal. Följ dessa steg för att börja sälja dina erbjudanden.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Steg 1 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold">Registrera dig</h3>
              <p className="text-gray-600">
                Välj ett av våra partnerpaket och fyll i dina salongsuppgifter.
              </p>
              <div className="pt-2">
                <ArrowRight className="h-5 w-5 mx-auto text-gray-400 md:rotate-90 lg:rotate-0" />
              </div>
            </div>

            {/* Steg 2 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold">Skapa erbjudanden</h3>
              <p className="text-gray-600">
                Logga in på din dashboard och skapa attraktiva erbjudanden för dina tjänster.
              </p>
              <div className="pt-2">
                <ArrowRight className="h-5 w-5 mx-auto text-gray-400 md:rotate-90 lg:rotate-0" />
              </div>
            </div>

            {/* Steg 3 */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold">Få nya kunder</h3>
              <p className="text-gray-600">
                Dina erbjudanden publiceras på Lyxdeal och kunderna kan söka och hitta din salong.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Fördelarna med att vara partner</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Ökad synlighet för din salong på Lyxdeal.se</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Attrahera nya kunder genom attraktiva erbjudanden</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Enkel hantering via användarvänlig administratörspanel</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Ingen fast kostnad - du betalar bara för ditt abonnemang</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Fullständig kontroll över dina erbjudanden</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
