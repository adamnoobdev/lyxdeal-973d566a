
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, ArrowRight } from "lucide-react";

interface SuccessMessageProps {
  onReset: () => void;
  email: string | null;
}

export const SuccessMessage = ({ onReset, email }: SuccessMessageProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800">
        Erbjudandet är säkrat!
      </h3>
      
      <div className="space-y-4 max-w-md">
        <div className="flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 py-3 rounded-lg">
          <Mail className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Din rabattkod har skickats till <strong>{email}</strong>
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">Nästa steg:</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-primary text-white rounded-full text-xs mr-2">1</span>
              <span>Kontrollera din e-post efter rabattkoden</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-primary text-white rounded-full text-xs mr-2">2</span>
              <span>Koden är giltig i <strong>72 timmar</strong></span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-primary text-white rounded-full text-xs mr-2">3</span>
              <span>Visa koden hos salongen för att lösa in erbjudandet</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200 w-full flex flex-col gap-3">
        <Button 
          onClick={onReset}
          variant="outline"
          className="w-full group flex items-center justify-center"
        >
          Säkra ett annat erbjudande
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};
