
import { Button } from "@/components/ui/button";
import { FC } from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton: FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <span className="flex items-center">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Sparar...
        </span>
      ) : (
        "Spara ändringar"
      )}
    </Button>
  );
};
