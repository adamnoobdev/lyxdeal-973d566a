
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const WelcomeAlert = () => {
  return (
    <Alert className="bg-primary/5 border-primary/20 mb-4 sm:mb-6">
      <InfoIcon className="h-4 w-4 text-primary" />
      <AlertDescription className="text-primary-foreground">
        Välkommen till din salongdashboard! Här kan du skapa och hantera erbjudanden, 
        se statistik och hantera kundlistor.
      </AlertDescription>
    </Alert>
  );
};
