
import { Button } from "@/components/ui/button";
import { QrCode, ShieldCheck, Smartphone, Sparkles, Ticket, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DiscountCodeSection = () => {
  const navigate = useNavigate();
  
  const handleSignupClick = () => {
    navigate("/partner/signup");
    window.scrollTo(0, 0);
  };
  
  return (
    <div id="discount-codes" className="py-10 md:py-16 bg-white">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
            Unika rabattkoder för din salong
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Vår avancerade rabattkodsfunktion ger dig full kontroll över dina erbjudanden och hjälper dig att konvertera fler kunder.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Vänster kolumn: Bild/illustration */}
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 md:p-8 flex flex-col justify-center">
            <div className="relative aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 max-w-md space-y-6">
                  {/* Illustrativ demonstration av rabattkodssystemet */}
                  <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <div className="flex items-center space-x-3 mb-3 md:mb-4">
                      <Ticket className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      <h3 className="font-semibold text-sm md:text-base">Dina skräddarsydda rabattkoder</h3>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <div className="p-2 md:p-3 bg-gray-100 rounded flex items-center justify-between">
                        <span className="font-mono text-xs md:text-sm">BEAUTYXYZ123</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Tillgänglig</span>
                      </div>
                      <div className="p-2 md:p-3 bg-gray-100 rounded flex items-center justify-between">
                        <span className="font-mono text-xs md:text-sm">BEAUTYABC456</span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Reserverad</span>
                      </div>
                      <div className="p-2 md:p-3 bg-gray-100 rounded flex items-center justify-between">
                        <span className="font-mono text-xs md:text-sm">BEAUTYLMN789</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Använd</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Höger kolumn: Fördelar */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary p-2 rounded-md mt-1">
                    <QrCode className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm md:text-base mb-1 md:mb-2">Unika engångskoder</h4>
                    <p className="text-gray-600 text-xs md:text-sm">Varje kod kan endast användas en gång, vilket säkerställer att dina erbjudanden inte missbrukas.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary p-2 rounded-md mt-1">
                    <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm md:text-base mb-1 md:mb-2">Spårbarhet och säkerhet</h4>
                    <p className="text-gray-600 text-xs md:text-sm">Följ exakt vilka koder som använts och av vem för fullständig kontroll över dina kampanjer.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary p-2 rounded-md mt-1">
                    <Smartphone className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm md:text-base mb-1 md:mb-2">Digital integration</h4>
                    <p className="text-gray-600 text-xs md:text-sm">Kunder får sin kod direkt i sin e-post eller telefon, vilket gör det enkelt att lösa in den.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary p-2 rounded-md mt-1">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm md:text-base mb-1 md:mb-2">Nya kunder utan arbete</h4>
                    <p className="text-gray-600 text-xs md:text-sm">Vi hanterar marknadsföringen och kundförvärvet medan du fokuserar på att leverera service.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleSignupClick}
                className="bg-primary hover:bg-primary/90 text-white shadow-md"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Kom igång med rabattkoder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
