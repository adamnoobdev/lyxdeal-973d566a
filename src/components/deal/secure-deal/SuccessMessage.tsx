
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface SuccessMessageProps {
  email: string;
  code: string | null;
  onReset: () => void;
}

export const SuccessMessage = ({ email, code, onReset }: SuccessMessageProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!code) return;
    
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        toast.success("Rabattkod kopierad!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Kunde inte kopiera rabattkoden");
      });
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">Grattis!</h2>
      <p className="text-gray-600 mb-6">
        Vi har skickat din rabattkod till <span className="font-medium">{email}</span>
      </p>
      
      {code && (
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Din rabattkod:</p>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-gray-100 px-4 py-2 rounded-md font-mono text-lg">
              {code}
            </div>
            <Button 
              size="icon"
              variant="outline" 
              onClick={copyToClipboard}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Spara eller kopiera denna kod om du inte får mejlet direkt
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Kontrollera din skräppost om du inte ser mejlet i din inkorg.
        </p>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={onReset}
        >
          Säkra ett annat erbjudande
        </Button>
      </div>
    </div>
  );
};
