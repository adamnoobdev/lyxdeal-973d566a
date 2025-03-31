
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface SecurityMessageProps {
  message: string | null;
  captchaVerified: boolean;
}

export const SecurityMessage: React.FC<SecurityMessageProps> = ({ 
  message, 
  captchaVerified 
}) => {
  if (!message) return null;
  
  return (
    <Alert variant={captchaVerified ? "default" : "destructive"} className="my-2">
      <AlertDescription className="flex items-center gap-2">
        {captchaVerified ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
        {message}
      </AlertDescription>
    </Alert>
  );
};
