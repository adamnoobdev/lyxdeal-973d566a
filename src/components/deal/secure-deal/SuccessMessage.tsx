
import React from 'react';
import { AlertCircle, Copy, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SuccessMessageProps {
  email: string;
  code: string | null;
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  email, 
  code,
  onReset 
}) => {
  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Rabattkod kopierad till urklipp!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <MailCheck className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Tack för din bokning!</h2>
        <p className="text-gray-600 mb-4">
          Vi har skickat ett bekräftelsemail med din rabattkod till <span className="font-semibold">{email}</span>.
        </p>
        
        {code && (
          <div className="w-full bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-sm text-gray-500 mb-1">Din rabattkod:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-lg font-semibold">{code}</span>
              <button 
                onClick={handleCopyCode}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                title="Kopiera kod"
              >
                <Copy className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-md mb-6 text-left">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700">
              Om du inte hittar mejlet inom några minuter, kontrollera din skräppost.
              <br />
              Rabattkoden är giltig i 72 timmar.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button variant="default" onClick={onReset} className="w-full">
          Boka ett nytt erbjudande
        </Button>
        <Button variant="outline" onClick={() => window.history.back()} className="w-full">
          Gå tillbaka
        </Button>
      </div>
    </div>
  );
};
