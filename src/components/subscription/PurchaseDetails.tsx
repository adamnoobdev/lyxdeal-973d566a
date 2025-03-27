
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { PurchaseDetails, SalonAccount } from "@/hooks/subscription/types";
import { formatDate } from "@/hooks/subscription/formatUtils";

interface PurchaseDetailsComponentProps {
  purchaseDetails: PurchaseDetails | null;
  salonAccount: SalonAccount | null;
  isRetrying: boolean;
  timeElapsed: number;
  onRetry: () => void;
}

export const PurchaseDetailsComponent = ({
  purchaseDetails,
  salonAccount,
  isRetrying,
  timeElapsed,
  onRetry
}: PurchaseDetailsComponentProps) => {
  if (!purchaseDetails) {
    return (
      <Alert className="mt-6 bg-gray-50 border-gray-200">
        <AlertTitle className="flex items-center text-gray-800">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Beställningsinformation
        </AlertTitle>
        <AlertDescription className="text-gray-700">
          Ingen beställningsinformation hittades. Kontakta oss på info@lyxdeal.se om du behöver hjälp.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Beställningsinformation</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Salong</p>
            <p className="font-medium">{purchaseDetails.business_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">E-post</p>
            <p className="font-medium">{purchaseDetails.email}</p>
          </div>
          {purchaseDetails.plan_title && (
            <div>
              <p className="text-sm text-gray-500">Paket</p>
              <p className="font-medium">{purchaseDetails.plan_title}</p>
            </div>
          )}
          {purchaseDetails.plan_payment_type && (
            <div>
              <p className="text-sm text-gray-500">Betalningsplan</p>
              <p className="font-medium">
                {purchaseDetails.plan_payment_type === 'monthly' ? 'Månadsvis' : 'Årsvis'}
              </p>
            </div>
          )}
          {purchaseDetails.created_at && (
            <div>
              <p className="text-sm text-gray-500">Beställningsdatum</p>
              <p className="font-medium">{formatDate(purchaseDetails.created_at)}</p>
            </div>
          )}
          {purchaseDetails.status && (
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{purchaseDetails.status}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Salongskonto</h3>
        
        {!salonAccount ? (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="flex items-center text-blue-800">
              <Loader2 className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              Skapar ditt konto
            </AlertTitle>
            <AlertDescription className="text-blue-800">
              <p>Vi håller på att skapa ditt salongskonto. Detta kan ta upp till 1-2 minuter.</p>
              <p className="mt-2">Tid förfluten: {timeElapsed} sekunder</p>
              
              {isRetrying ? (
                <p className="mt-2 italic">Kontrollerar kontostatus...</p>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRetry}
                  className="mt-3 bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                  Kontrollera status
                </Button>
              )}
            </AlertDescription>
          </Alert>
        ) : !salonAccount.isComplete ? (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTitle className="flex items-center text-amber-800">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Kontot håller på att skapas
            </AlertTitle>
            <AlertDescription className="text-amber-800">
              <p>Ditt salongskonto är delvis skapat men inloggning är inte redo än.</p>
              <p className="mt-2">Vänta några minuter och försök sedan igen.</p>
              
              {isRetrying ? (
                <p className="mt-2 italic">Kontrollerar kontostatus...</p>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRetry}
                  className="mt-3 bg-white text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  Kontrollera igen
                </Button>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="flex items-center text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              Kontot skapat!
            </AlertTitle>
            <AlertDescription className="text-green-800">
              <p>Ditt salongskonto har skapats. Du bör ha fått ett e-postmeddelande med inloggningsuppgifter.</p>
              <p className="mt-2">Du kan nu logga in på salongsportalen med din e-postadress: <strong>{salonAccount.email}</strong></p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
