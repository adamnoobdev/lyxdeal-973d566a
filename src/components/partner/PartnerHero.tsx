
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const PartnerHero = () => {
  const navigate = useNavigate();
  
  const handleContactClick = () => {
    // Navigera till prisformuläret längre ner på sidan
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleLoginClick = () => {
    navigate("/salon/login");
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-600">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-repeat bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/90"></div>
      <div className="container px-4 md:px-8 relative z-10">
        <div className="py-10 md:py-16 lg:py-28 flex flex-col items-center text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Väx din salongsverksamhet med Lyxdeal
            </h1>
            <p className="text-sm md:text-base lg:text-xl text-white/90 max-w-3xl mx-auto mb-6 md:mb-10">
              Nå nya kunder, öka din försäljning och stärk ditt varumärke genom att bli en av våra värdefulla salongspartners.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
              <Button 
                size="default" 
                className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto font-semibold shadow-lg text-sm md:text-base"
                onClick={handleContactClick}
              >
                Bli partner idag
              </Button>
              <Button 
                size="default" 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto font-semibold text-sm md:text-base"
                onClick={handleLoginClick}
              >
                Logga in som partner
              </Button>
            </div>
            <div className="mt-4 md:mt-6 text-white/80 text-xs md:text-sm">
              <p>Använd kod <span className="font-bold text-white">provmanad</span> för en gratis provmånad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
