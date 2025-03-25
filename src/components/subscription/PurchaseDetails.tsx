
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { PurchaseDetails, SalonAccount, formatDate } from "@/hooks/useSubscriptionDetails";

interface PurchaseDetailsProps {
  purchaseDetails: PurchaseDetails | null;
  salonAccount: SalonAccount | null;
  isRetrying: boolean;
  timeElapsed: number;
  onRetry: () => void;
}

export function PurchaseDetailsComponent({
  purchaseDetails,
  salonAccount,
  isRetrying,
  timeElapsed,
  onRetry
}: PurchaseDetailsProps) {
  if (!purchaseDetails) return null;
  
  const today = new Date();
  
  return (
    <div className="space-y-4 mt-4 border rounded-md p-4 bg-gray-50">
      <h3 className="text-lg font-medium">Prenumerationsdetaljer</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="font-medium">Företag:</p>
          <p>{purchaseDetails.business_name}</p>
        </div>
        
        <div>
          <p className="font-medium">Plan:</p>
          <p>{purchaseDetails.plan_title || 'Standard'}</p>
        </div>
        
        <div>
          <p className="font-medium">Betalningstyp:</p>
          <p>{purchaseDetails.plan_payment_type === 'yearly' ? 'Årsvis' : 'Månadsvis'}</p>
        </div>
        
        <div>
          <p className="font-medium">Startdatum:</p>
          <p>{formatDate(today)}</p>
        </div>
      </div>
      
      {salonAccount ? (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Konto skapat!</AlertTitle>
          <AlertDescription className="text-green-700">
            Ditt salongskonto har skapats framgångsrikt. Du kan nu logga in med den e-post och det lösenord som skickats till din e-postadress.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="mt-4">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Kontoskapande pågår
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              <p>Ditt konto håller på att skapas. Detta kan ta upp till några minuter. Du kommer att få ett e-postmeddelande med inloggningsuppgifter.</p>
              <p className="mt-1 text-xs">Tid som passerat: {timeElapsed} sekunder</p>
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center gap-2"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kontrollerar...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Kontrollera igen
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
