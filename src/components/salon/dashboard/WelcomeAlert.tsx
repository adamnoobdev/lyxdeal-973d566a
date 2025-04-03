
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface WelcomeAlertProps {
  onCreateClick?: () => void;
}

export const WelcomeAlert = ({ onCreateClick }: WelcomeAlertProps) => {
  return (
    <Alert className="bg-secondary/20 border-secondary border mb-4 sm:mb-6 shadow-sm">
      <InfoIcon className="h-4 w-4 text-primary" />
      <AlertDescription className="text-foreground">
        Välkommen till din salongdashboard! Här kan du skapa och hantera erbjudanden, 
        se statistik och hantera kundlistor.
      </AlertDescription>
    </Alert>
  );
};
