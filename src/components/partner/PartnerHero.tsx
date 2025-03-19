
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const PartnerHero = () => {
  const navigate = useNavigate();
  
  const handleContactClick = () => {
    // Navigera till kontaktformuläret längre ner på sidan
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10"></div>
      <div className="container px-4 md:px-8 relative z-10">
        <div className="py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Väx din salongsverksamhet med Lyxdeal
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
            Nå nya kunder, öka din försäljning och stärk ditt varumärke genom att bli en av våra värdefulla salongspartners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={handleContactClick}
            >
              Bli partner idag
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/salon/login")}
            >
              Logga in som partner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
