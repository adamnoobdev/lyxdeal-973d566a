
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Copy, XCircle } from "lucide-react";
import { formatDistance } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DiscountCodesListProps {
  codes: any[];
}

export const DiscountCodesList = ({ codes }: DiscountCodesListProps) => {
  if (!codes || codes.length === 0) {
    return <div className="text-center py-8">Inga rabattkoder hittades</div>;
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Kopierat till urklipp!", { duration: 2000 });
  };

  return (
    <div className="space-y-2">
      {codes.map((code) => (
        <div 
          key={code.id} 
          className="flex items-center justify-between p-3 bg-white border rounded-md hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {code.is_used ? (
                <div className="bg-destructive p-1">
                  <XCircle className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="bg-primary p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">{code.code}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => copyToClipboard(code.code)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-500">
                {code.created_at && (
                  <span>
                    Skapad {formatDistance(new Date(code.created_at), new Date(), { 
                      addSuffix: true,
                      locale: sv 
                    })}
                  </span>
                )}
                {code.used_at && (
                  <span className="ml-2">
                    • Använd {formatDistance(new Date(code.used_at), new Date(), { 
                      addSuffix: true,
                      locale: sv 
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Badge variant={code.is_used ? "destructive" : "primary"}>
              {code.is_used ? "Använd" : "Tillgänglig"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
