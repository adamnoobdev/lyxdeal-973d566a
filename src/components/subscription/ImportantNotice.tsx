
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const ImportantNotice = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertTitle className="flex items-center text-blue-800">
        <AlertTriangle className="h-4 w-4 mr-2" /> Viktigt
      </AlertTitle>
      <AlertDescription className="text-blue-800">
        Om du inte hittar mejlet inom några minuter, kontrollera din spammapp. Om du fortfarande inte hittar det, kontakta oss på info@lyxdeal.se.
      </AlertDescription>
    </Alert>
  );
};
