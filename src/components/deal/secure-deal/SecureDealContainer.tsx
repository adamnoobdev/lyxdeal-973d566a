
import { useClaimCheck } from "@/hooks/useClaimCheck";
import { useSecureDealSubmit } from "@/hooks/useSecureDealSubmit";
import { SecureForm } from "./SecureForm";
import { SuccessMessage } from "./SuccessMessage";
import { AlreadyClaimedMessage } from "./AlreadyClaimedMessage";

interface SecureDealContainerProps {
  dealId: number;
  dealTitle: string;
  onSuccess?: () => void;
}

export const SecureDealContainer = ({ 
  dealId, 
  dealTitle,
  onSuccess 
}: SecureDealContainerProps) => {
  // Check if user has already claimed this deal
  const { hasAlreadyClaimed, isCheckingClaim } = useClaimCheck(dealId);
  
  // Handle form submission and code generation
  const {
    handleSubmit,
    isSubmitting,
    isSuccess,
    alreadyClaimed,
    emailSent,
    handleReset
  } = useSecureDealSubmit(dealId.toString());

  // Handle going back to deal page
  const handleGoBack = () => {
    window.history.back();
  };

  if (isCheckingClaim) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-gray-600 animate-pulse">Kontrollerar tidigare anspråk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {hasAlreadyClaimed || alreadyClaimed ? (
        <AlreadyClaimedMessage onGoBack={handleGoBack} />
      ) : isSuccess ? (
        <SuccessMessage onReset={handleReset} email={emailSent} />
      ) : (
        <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
};
