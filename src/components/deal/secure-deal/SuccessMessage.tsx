
import { Button } from "@/components/ui/button";
import { Check, MailCheck } from "lucide-react";

interface SuccessMessageProps {
  onReset: () => void;
  email: string | null;
  code?: string | null;
}

export const SuccessMessage = ({ onReset, email }: SuccessMessageProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800">Erbjudande säkrat!</h2>
      
      {email ? (
        <div className="bg-blue-50 p-4 rounded-lg text-left">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <MailCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                En rabattkod har skickats till <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Kolla din inkorg och skräppost om du inte hittar e-postmeddelandet
              </p>
            </div>
          </div>
        </div>
      ) : null}
      
      <p className="text-sm text-gray-600">
        Tack för att du använder Lyxdeal! Din rabattkod har skickats till din e-post och gäller i 72 timmar. Visa rabattkoden när du besöker salongen.
      </p>
      
      <div className="pt-4">
        <Button onClick={onReset} variant="outline" className="mr-2">
          Säkra ett annat erbjudande
        </Button>
      </div>
    </div>
  );
};
