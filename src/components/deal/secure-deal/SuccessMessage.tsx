
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, RotateCcw } from "lucide-react";

interface SuccessMessageProps {
  onReset: () => void;
  email?: string | null;
}

export const SuccessMessage = ({ onReset, email }: SuccessMessageProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">Rabattkod säkrad!</h3>
        <p className="text-gray-600">
          Vi har skickat en unik rabattkod till dig via e-post. Kolla din inkorg!
        </p>
        
        {email && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 inline-flex items-center gap-2 text-blue-700">
            <Mail className="h-4 w-4" />
            <span className="font-medium">{email}</span>
          </div>
        )}
      </div>
      
      <div className="pt-4 space-y-3">
        <p className="text-sm text-gray-500">
          Du bör få e-postmeddelandet inom några minuter. Om det inte dyker upp, kolla din skräppost.
        </p>
        
        <Button 
          variant="outline" 
          onClick={onReset}
          className="mt-4 inline-flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Säkra en till rabattkod
        </Button>
      </div>
    </div>
  );
};
