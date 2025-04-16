
import { ArrowRight, User, Code, Calculator, CreditCard, Share2 } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      title: "Ansök",
      description: "Fyll i ansökningsformuläret och berätta om ditt konto och följare.",
      icon: <User className="h-6 w-6" />
    },
    {
      title: "Skapa innehåll",
      description: "Producera autentiskt innehåll på Instagram eller TikTok om skönhetsbehandlingar.",
      icon: <Share2 className="h-6 w-6" />
    },
    {
      title: "Få dina koder",
      description: "Få personliga rabattkoder och en gratis behandling att skapa innehåll om.",
      icon: <Code className="h-6 w-6" />
    },
    {
      title: "Tjäna provision",
      description: "Få en procentandel för varje bokad behandling genom dina rekommendationer.",
      icon: <CreditCard className="h-6 w-6" />
    }
  ];

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Så här fungerar det</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enkelt sätt att tjäna pengar genom att rekommendera skönhetsbehandlingar.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 text-purple-600">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:flex justify-center mt-4">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
