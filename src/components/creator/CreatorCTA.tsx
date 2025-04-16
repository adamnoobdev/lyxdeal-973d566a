
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CreatorCTA = () => {
  const navigate = useNavigate();
  
  const handleSignupClick = () => {
    navigate("/creator/signup");
    window.scrollTo(0, 0);
  };
  
  const steps = [
    "Ansök på mindre än 2 minuter",
    "Bli godkänd baserat på din profil",
    "Få tillgång till gratis behandlingar",
    "Skapa innehåll och dela med dina följare"
  ];

  return (
    <div className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-repeat bg-center"></div>
      
      <div className="container px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Kom igång som kreatör idag</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Få tillgång till kostnadsfria skönhetsbehandlingar och gör skillnad för lokala företag.
            </p>
          </div>
          
          {/* Steps Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-none shadow-sm border border-accent/10">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={handleSignupClick}
              size="lg" 
              className="group font-bold shadow-md"
            >
              <span>Ansök som kreatör</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Gratis att ansöka. Vi återkommer med svar inom 48 timmar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
