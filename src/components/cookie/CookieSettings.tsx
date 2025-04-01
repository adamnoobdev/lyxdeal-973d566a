
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CookieSettings() {
  const [open, setOpen] = useState(false);
  const { acceptCookies, rejectCookies } = useCookieConsent();
  
  const handleAccept = () => {
    acceptCookies();
    setOpen(false);
  };

  const handleReject = () => {
    rejectCookies();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          <Settings className="h-3 w-3 mr-1" />
          Cookie-inställningar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
  );
}
