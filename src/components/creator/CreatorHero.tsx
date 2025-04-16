
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Instagram, TiktokIcon } from "lucide-react";

export const CreatorHero = () => {
  const navigate = useNavigate();
  
  const handleSignupClick = () => {
    navigate("/creator/signup");
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-500">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-repeat bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/90"></div>
      <div className="container px-4 md:px-8 relative z-10">
        <div className="py-10 md:py-16 lg:py-28 flex flex-col items-center text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Tjäna pengar genom att rekommendera skönhetsbehandlingar
            </h1>
            <p className="text-sm md:text-base lg:text-xl text-white/90 max-w-3xl mx-auto mb-6 md:mb-10">
              Skapa innehåll på Instagram och TikTok, få gratis behandlingar och en procentandel på varje såld behandling. 
              Ingen försäljning sker på vår plattform - du marknadsför, vi hanterar bokningen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
              <Button 
                size="default" 
                className="bg-white text-purple-600 hover:bg-white/90 w-full sm:w-auto font-semibold shadow-lg text-sm md:text-base flex items-center gap-2"
                onClick={handleSignupClick}
              >
                <Instagram size={18} />
                <TiktokIcon size={18} className="mr-2" />
                Bli kreatör
              </Button>
            </div>
            <div className="mt-4 md:mt-6 text-white/80 text-xs md:text-sm">
              <p>Över 100 kreatörer tjänar redan pengar på sina rekommendationer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
