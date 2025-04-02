
import { Deal } from "@/types/deal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface DiscountCodesDirectBookingProps {
  deal: Deal | null;
}

export const DiscountCodesDirectBooking = ({ deal }: DiscountCodesDirectBookingProps) => {
  if (!deal) return null;

  if (!deal.booking_url) {
    return (
      <Alert variant="destructive">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Ingen bokningslänk</AlertTitle>
        <AlertDescription>
          Detta erbjudande har ingen bokningslänk satt. Kunder kommer inte kunna boka erbjudandet.
          Vänligen uppdatera erbjudandet och lägg till en bokningslänk.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Direkt bokning</AlertTitle>
        <AlertDescription>
          Detta erbjudande använder direkt bokning istället för rabattkoder. Kunder kommer att länkas direkt till din bokningssida.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-4 w-4" /> Bokningslänk
          </CardTitle>
          <CardDescription>
            Kunder kommer att skickas till denna länk när de vill utnyttja erbjudandet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="break-all max-w-full overflow-hidden">
              {deal.booking_url}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0"
              onClick={() => window.open(deal.booking_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Öppna länk
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
