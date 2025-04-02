
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  onReset: () => void;
  email: string | null;
}

export const SuccessMessage = ({ onReset, email }: SuccessMessageProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800">
        Erbjudandet är säkrat!
      </h3>
      
      <div className="space-y-3">
        <p className="text-gray-600">
          Din rabattkod har skickats till <strong>{email}</strong>
        </p>
        
        <p className="text-sm text-gray-500">
          Koden är giltig i 72 timmar och kan användas hos salongen.
          Om du inte hittar e-postmeddelandet, kolla din skräppost.
        </p>
      </div>
      
      <div className="pt-4 border-t border-gray-200 w-full flex flex-col gap-3">
        <Button 
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          Säkra ett annat erbjudande
        </Button>
      </div>
    </div>
  );
};
