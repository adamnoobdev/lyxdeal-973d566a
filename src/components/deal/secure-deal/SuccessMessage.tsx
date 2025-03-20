
import { Button } from "@/components/ui/button";
import { Check, Copy, MailCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SuccessMessageProps {
  onReset: () => void;
  email: string | null;
  code?: string | null;
}

export const SuccessMessage = ({ onReset, email, code }: SuccessMessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Rabattkod kopierad till urklipp");
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

      {code ? (
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-2">Din rabattkod:</p>
          <div className="flex items-center gap-2 justify-center">
            <div className="bg-gray-100 px-4 py-2 rounded-md font-mono text-lg tracking-wider">
              {code}
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCopyCode}
              className="flex items-center gap-1"
            >
              {copied ? "Kopierad!" : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Spara denna kod! Koden är giltig i 72 timmar.
          </p>
        </div>
      ) : null}
      
      <p className="text-sm text-gray-600">
        Tack för att du använder Lyxdeal! Du kan nu visa rabattkoden när du besöker salongen.
      </p>
      
      <div className="pt-4">
        <Button onClick={onReset} variant="outline" className="mr-2">
          Säkra ett annat erbjudande
        </Button>
      </div>
    </div>
  );
};
