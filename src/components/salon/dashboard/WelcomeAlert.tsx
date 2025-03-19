
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const WelcomeAlert = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-blue-700">
        Välkommen till din salongdashboard! Här kan du skapa och hantera erbjudanden, 
        se statistik och hantera kundlistor.
      </AlertDescription>
    </Alert>
  );
};
