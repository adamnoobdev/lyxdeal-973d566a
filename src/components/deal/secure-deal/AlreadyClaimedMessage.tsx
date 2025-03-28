
import { Button } from "@/components/ui/button";

interface AlreadyClaimedMessageProps {
  onGoBack: () => void;
}

export const AlreadyClaimedMessage = ({ onGoBack }: AlreadyClaimedMessageProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Du har redan säkrat detta erbjudande
      </h2>
      <p className="text-gray-600 mb-4">
        Du kan endast säkra ett erbjudande en gång. Kontrollera din e-post efter den rabattkod som redan skickats.
      </p>
      <Button
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        onClick={onGoBack}
      >
        Tillbaka till erbjudandet
      </Button>
    </div>
  );
};
