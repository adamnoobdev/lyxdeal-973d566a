
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { SalonAccount } from "@/hooks/subscription/types";

interface AccountCreationStatusProps {
  salonAccount: SalonAccount | null;
  isRetrying: boolean;
  timeElapsed: number;
  onRetry: () => void;
}

export const AccountCreationStatus = ({
  salonAccount,
  isRetrying,
  timeElapsed,
  onRetry
}: AccountCreationStatusProps) => {
  if (!salonAccount) {
    return (
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
    );
  }
  
  if (!salonAccount.isComplete) {
    return (
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
    );
  }
  
  return (
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
  );
};
