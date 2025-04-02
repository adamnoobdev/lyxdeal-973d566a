
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end pt-4">
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="px-6 bg-primary hover:bg-primary/90 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sparar...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Spara ändringar
          </>
        )}
      </Button>
    </div>
  );
};
