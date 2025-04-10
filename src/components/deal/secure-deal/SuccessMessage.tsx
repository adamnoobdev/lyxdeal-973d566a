
import { Button } from "@/components/ui/button";
import { Check, Copy, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface SuccessMessageProps {
  email: string;
  code: string | null;
  onReset: () => void;
  emailError?: string | null;
}

export const SuccessMessage = ({ email, code, onReset, emailError }: SuccessMessageProps) => {
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
      <p className="text-gray-600 mb-4">
        Vi har skickat din rabattkod till {email}
      </p>
      
      {emailError && (
        <Alert variant="destructive" className="mb-4 text-left">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription className="text-sm">
            Det gick inte att skicka e-post. Spara koden nedan.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Visa bara koden om e-post skickning misslyckades */}
      {code && emailError && (
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Din rabattkod:</p>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-gray-100 px-4 py-2 rounded-md font-mono text-lg select-all">
              {code}
            </div>
            <Button 
              size="icon"
              variant="outline" 
              onClick={copyToClipboard}
              className="flex-shrink-0"
              title="Kopiera rabattkod"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Spara eller kopiera denna kod eftersom e-postskickningen misslyckades
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        {!emailError && (
          <p className="text-sm text-gray-500">
            Kontrollera din skräppost om du inte ser mejlet i din inkorg.
          </p>
        )}
        
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

