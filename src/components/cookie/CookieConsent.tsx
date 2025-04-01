
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { consentStatus, acceptCookies, rejectCookies } = useCookieConsent();
  
  useEffect(() => {
    // Visa banner endast om status är "pending"
    if (consentStatus === 'pending') {
      // Liten fördröjning för att säkerställa att komponenten har monterats korrekt
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowBanner(false);
    }
  }, [consentStatus]);

  const handleAccept = () => {
    acceptCookies();
    setShowBanner(false);
    setShowDialog(false);
  };

  const handleReject = () => {
    rejectCookies();
    setShowBanner(false);
    setShowDialog(false);
  };

  const handlePreferences = () => {
    setShowDialog(true);
  };

  if (!showBanner && !showDialog) {
    return null;
  }

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 z-50 shadow-lg animate-fade-up">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Vi använder cookies</h3>
                  <p className="text-sm text-gray-600">
                    Vi använder cookies för att förbättra din upplevelse, visa relevant innehåll och för att analysera trafik. 
                    Du kan välja att acceptera alla cookies eller anpassa dina inställningar.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReject}
                  className="text-sm"
                >
                  Avböj
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePreferences}
                  className="text-sm"
                >
                  Inställningar
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAccept}
                  className="text-sm bg-primary hover:bg-primary/90"
                >
                  Acceptera alla
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cookie-inställningar</DialogTitle>
            <DialogDescription>
              Hantera dina cookie-preferenser för vår webbplats.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Nödvändiga cookies</h4>
              <p className="text-sm text-gray-500">
                Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Analytiska cookies</h4>
                <div className="text-sm text-gray-500">Används för Google Analytics</div>
              </div>
              <p className="text-sm text-gray-500">
                Hjälper oss att förstå hur besökare interagerar med webbplatsen genom att samla in och rapportera information anonymt.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Marknadsföringscookies</h4>
                <div className="text-sm text-gray-500">Används för riktad reklam</div>
              </div>
              <p className="text-sm text-gray-500">
                Dessa cookies används för att spåra besökare på webbplatser. Avsikten är att visa annonser som är relevanta och engagerande för den enskilda användaren.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" onClick={handleReject}>Avböj alla</Button>
            <Button onClick={handleAccept}>Acceptera alla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
