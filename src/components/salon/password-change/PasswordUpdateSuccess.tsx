
import { Check } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface PasswordUpdateSuccessProps {
  onClose: () => void;
}

export const PasswordUpdateSuccess: React.FC<PasswordUpdateSuccessProps> = ({ 
  onClose 
}) => {
  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-center text-center">
        <div className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-green-700">Lösenordet har uppdaterats</h3>
          <p className="text-sm text-muted-foreground">
            Ditt lösenord har uppdaterats framgångsrikt. Du kan nu fortsätta använda tjänsten.
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={onClose} className="px-8">Stäng</Button>
      </div>
    </div>
  );
};
