
import { ArrowRight } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <div id="how-it-works" className="py-10 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Hur fungerar det?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Det är enkelt att komma igång som salongspartner med Lyxdeal. Följ dessa steg för att börja sälja dina erbjudanden.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-3">
            {/* Steg 1 */}
            <div className="bg-white rounded-lg shadow-sm p-5 md:p-6 flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-none flex items-center justify-center">
                <span className="font-bold text-primary">1</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold">Registrera dig</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Välj ett av våra partnerpaket och fyll i dina salongsuppgifter.
              </p>
              <div className="pt-1 md:pt-2">
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 mx-auto text-gray-400 rotate-90 md:rotate-0" />
              </div>
            </div>

            {/* Steg 2 */}
            <div className="bg-white rounded-lg shadow-sm p-5 md:p-6 flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-none flex items-center justify-center">
                <span className="font-bold text-primary">2</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold">Skapa erbjudanden</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Logga in på din dashboard och skapa attraktiva erbjudanden för dina tjänster.
              </p>
              <div className="pt-1 md:pt-2">
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 mx-auto text-gray-400 rotate-90 md:rotate-0" />
              </div>
            </div>

            {/* Steg 3 */}
            <div className="bg-white rounded-lg shadow-sm p-5 md:p-6 flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-none flex items-center justify-center">
                <span className="font-bold text-primary">3</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold">Få nya kunder</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Dina erbjudanden publiceras på Lyxdeal och kunderna kan söka och hitta din salong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
