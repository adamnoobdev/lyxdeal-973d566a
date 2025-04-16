
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ContactSection = () => {
  const navigate = useNavigate();
  
  const handleSignupClick = () => {
    navigate("/creator/signup");
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="py-12 md:py-16 bg-gradient-to-br from-purple-600 to-pink-500 text-white">
      <div className="container px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Redo att bli kreatör?</h2>
          <p className="mb-8 text-white/80">
            Ansök idag och börja tjäna pengar på dina rekommendationer. 
            Vi granskar alla ansökningar och återkommer inom 48 timmar.
          </p>
          <Button 
            onClick={handleSignupClick}
            size="lg" 
            className="bg-white text-purple-600 hover:bg-white/90"
          >
            Ansök nu
          </Button>
        </div>
      </div>
    </div>
  );
};
