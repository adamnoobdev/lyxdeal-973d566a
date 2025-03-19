
import { SecureDealContainer } from "./secure-deal/SecureDealContainer";

interface SecureDealFormProps {
  dealId: number;
  dealTitle: string;
  onSuccess?: () => void;
}

export const SecureDealForm = ({ 
  dealId, 
  dealTitle,
  onSuccess 
}: SecureDealFormProps) => {
  return (
    <div className="w-full">
      <SecureDealContainer
        dealId={dealId}
        dealTitle={dealTitle}
        onSuccess={onSuccess}
      />
    </div>
  );
};
