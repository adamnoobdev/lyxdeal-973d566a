
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
    <SecureDealContainer
      dealId={dealId}
      dealTitle={dealTitle}
      onSuccess={onSuccess}
    />
  );
};
