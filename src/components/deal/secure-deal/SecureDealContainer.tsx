
import { useClaimCheck } from "@/hooks/useClaimCheck";
import { useSecureDealSubmit } from "@/hooks/useSecureDealSubmit";
import { SecureForm, SecureFormValues } from "./SecureForm";
import { SuccessMessage } from "./SuccessMessage";
import { AlreadyClaimedMessage } from "./AlreadyClaimedMessage";
import { Loader2 } from "lucide-react";

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
    isSubmitting,
    isSuccess,
    emailSent,
    handleSubmit,
    handleReset
  } = useSecureDealSubmit({
    dealId,
    dealTitle,
    onSuccess,
    hasAlreadyClaimed
  });

  // Handle going back to deal page
  const handleGoBack = () => {
    window.history.back();
  };

  if (isCheckingClaim) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center min-h-[200px] py-6">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Kontrollerar tidigare anspråk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {hasAlreadyClaimed ? (
        <AlreadyClaimedMessage onGoBack={handleGoBack} />
      ) : isSuccess ? (
        <SuccessMessage onReset={handleReset} email={emailSent} />
      ) : (
        <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
};
