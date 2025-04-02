
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";

interface AlreadyClaimedMessageProps {
  onGoBack: () => void;
}

export const AlreadyClaimedMessage = ({ onGoBack }: AlreadyClaimedMessageProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100">
        <AlertCircle className="h-10 w-10 text-amber-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800">
        Du har redan säkrat detta erbjudande
      </h2>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
        <p>
          Du kan endast säkra ett erbjudande en gång. Kontrollera din e-post efter den rabattkod som redan skickats.
        </p>
        <p className="mt-2 flex items-center justify-center">
          <Mail className="h-4 w-4 mr-2" />
          Hittar du inte e-postmeddelandet? Kontrollera din skräppost.
        </p>
      </div>
      
      <Button
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
        onClick={onGoBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till erbjudandet
      </Button>
    </div>
  );
};
