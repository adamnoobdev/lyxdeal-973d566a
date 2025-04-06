
import { Button } from "@/components/ui/button";

interface DialogFooterButtonsProps {
  onClose: () => void;
  onSave: () => void;
  disabled: boolean;
  submitting: boolean;
  ratingValue: number;
}

export const DialogFooterButtons = ({
  onClose,
  onSave,
  disabled,
  submitting,
  ratingValue
}: DialogFooterButtonsProps) => {
  return (
    <div className="flex flex-col xs:flex-row gap-2 w-full sm:justify-end">
      <Button 
        variant="outline" 
        onClick={onClose} 
        disabled={submitting} 
        className="w-full xs:w-auto"
      >
        Avbryt
      </Button>
      <Button 
        onClick={onSave} 
        disabled={ratingValue === 0 || submitting || disabled} 
        className="w-full xs:w-auto"
      >
        {submitting ? "Sparar..." : "Spara betyg"}
      </Button>
    </div>
  );
};
