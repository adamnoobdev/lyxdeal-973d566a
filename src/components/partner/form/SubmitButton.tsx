
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Skickar..." : "Skicka ansökan"}
    </Button>
  );
};
