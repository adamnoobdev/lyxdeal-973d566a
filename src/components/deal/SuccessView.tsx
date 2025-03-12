
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
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
    <div className="space-y-6 py-4 text-center">
      <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Erbjudandet är säkrat!</h3>
        <p className="text-sm text-muted-foreground">
          Tack för att du säkrade "{dealTitle}". Din rabattkod har skickats till din e-post.
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-xs text-gray-500 mb-2">Din rabattkod (giltig i 72 timmar)</p>
        <div className="flex items-center justify-between gap-2">
          <code className="font-mono text-lg font-bold tracking-wide">{discountCode}</code>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleCopyCode}
            className="flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Kopierad</span>
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
      
      <Button onClick={onClose} className="w-full">Stäng</Button>
    </div>
  );
};
