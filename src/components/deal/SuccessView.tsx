
import { Button } from "@/components/ui/button";
import { Check, Copy, Timer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SuccessViewProps {
  dealTitle: string;
  discountCode: string;
  onClose: () => void;
}

export const SuccessView = ({ dealTitle, discountCode, onClose }: SuccessViewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    toast.success("Rabattkoden har kopierats!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center space-y-4">
        <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg text-green-800">
            Erbjudandet är säkrat!
          </h3>
          <p className="text-green-700">
            Din rabattkod har skickats till din e-post
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="h-4 w-4 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">
            Koden är giltig i 72 timmar
          </p>
        </div>
        <div className="bg-white rounded-md p-3 sm:p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">Din rabattkod</p>
          <div className="flex items-center justify-between gap-2">
            <code className="font-mono text-base sm:text-lg font-bold tracking-wide text-gray-900 break-all">
              {discountCode}
            </code>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Kopierad</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Kopiera</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600">
          Besök salongen och visa upp din rabattkod för att ta del av erbjudandet.
          Betala direkt hos salongen vid ditt besök.
        </p>
        <Button onClick={onClose} className="w-full">Stäng</Button>
      </div>
    </div>
  );
};
