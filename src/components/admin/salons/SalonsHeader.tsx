
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { updateAllSalonsTermsAcceptance } from "@/utils/salon/salonDbQueries";
import { toast } from "sonner";

interface SalonsHeaderProps {
  error: string | null;
  onCreateClick: () => void;
}

export const SalonsHeader = ({ error, onCreateClick }: SalonsHeaderProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleUpdateAllTerms = async () => {
    try {
      setIsUpdating(true);
      const success = await updateAllSalonsTermsAcceptance();
      
      if (success) {
        toast.success('Alla salonger har godkänt villkoren och integritetspolicyn', {
          description: 'Uppdateringen lyckades. Du kan behöva ladda om sidan för att se ändringarna.',
        });
      } else {
        toast.error('Ett fel uppstod vid uppdatering av salonger', {
          description: 'Försök igen senare eller kontakta support.',
        });
      }
    } catch (error) {
      console.error("Error updating all salons:", error);
      toast.error('Ett fel uppstod vid uppdatering', {
        description: error instanceof Error ? error.message : 'Okänt fel',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Salonger</h2>
          <p className="text-muted-foreground">
            Hantera salonger och deras konton
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleUpdateAllTerms}
            disabled={isUpdating}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isUpdating ? "Uppdaterar..." : "Godkänn alla villkor"}
          </Button>
          <Button onClick={onCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ny salong
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
