
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SuccessMessageProps {
  email?: string | null;
  code?: string | null; 
  onReset?: () => void;
}

export const SuccessMessage = ({ email, code, onReset }: SuccessMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const copyToClipboard = () => {
    if (!code) return;
    
    navigator.clipboard.writeText(code)
      .then(() => {
        setIsCopied(true);
        toast.success("Rabattkoden har kopierats till urklipp");
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch(err => {
        console.error("Could not copy text: ", err);
        toast.error("Kunde inte kopiera koden");
      });
  };

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          Ditt erbjudande är säkrat!
        </h3>
        
        {email && (
          <p className="mt-2 text-gray-600">
            En bekräftelse har skickats till <span className="font-medium">{email}</span>
          </p>
        )}
      </div>
      
      {code && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Din rabattkod:</p>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-white px-4 py-2 rounded border border-gray-300 font-mono font-bold text-lg">
              {code}
            </div>
            <Button 
              size="icon" 
              variant="outline" 
              onClick={copyToClipboard}
              className="flex-shrink-0"
            >
              <Copy className={`h-4 w-4 ${isCopied ? "text-green-500" : ""}`} />
            </Button>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Spara den här koden! Du behöver visa den när du besöker salongen.
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        <Button 
          className="w-full" 
          onClick={() => window.history.back()}
        >
          Tillbaka till erbjudandet
        </Button>
        
        {onReset && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onReset}
          >
            Säkra ett nytt erbjudande
          </Button>
        )}
      </div>
    </div>
  );
};
