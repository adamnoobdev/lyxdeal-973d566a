
import { Deal } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/components/salon/subscription/types";

interface DiscountCodesDirectBookingProps {
  deal: Deal | null;
}

export const DiscountCodesDirectBooking = ({ deal }: DiscountCodesDirectBookingProps) => {
  if (!deal) return null;
  
  // Get subscription plan as a string value
  const subscription_plan = "Premiumpaket";
  
  // Check if the plan is Baspaket by comparing strings directly
  const hasBasicPackage = subscription_plan === "Baspaket";
  
  return (
    <div className="p-4 rounded-lg bg-muted/20 border space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Direkt bokning</h3>
        <p className="text-sm text-muted-foreground">
          Detta erbjudande använder direkt bokning utan rabattkoder. 
          När kunder väljer att köpa erbjudandet kommer de att dirigeras till din bokningssida.
        </p>
        
        {deal.booking_url ? (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-background border rounded-md">
              <div className="text-xs text-muted-foreground mb-1">Bokningslänk:</div>
              <div className="font-medium break-all text-sm">{deal.booking_url}</div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.open(deal.booking_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Testa länken
            </Button>
          </div>
        ) : (
          <div className="p-4 border border-orange-200 bg-orange-50 text-orange-700 rounded-md text-sm mt-4">
            <p className="font-medium">Varning: Ingen bokningslänk angiven</p>
            <p className="mt-1">
              Detta erbjudande saknar en bokningslänk. Kunder kommer inte att kunna slutföra sina köp.
              Uppdatera erbjudandet för att lägga till en bokningslänk.
            </p>
          </div>
        )}
        
        {hasBasicPackage && (
          <div className="p-4 border border-blue-200 bg-blue-50 text-blue-600 rounded-md text-sm mt-4">
            <p className="font-medium">Baspaketet använder endast direkt bokning</p>
            <p className="mt-1">
              Ditt Baspaket inkluderar endast direkt bokning utan rabattkoder. 
              Uppgradera till Premiumpaket för att få tillgång till rabattkoder.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
