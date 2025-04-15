
import { useClaimCheck } from "@/hooks/useClaimCheck";
import { useSecureDealSubmit } from "@/hooks/useSecureDealSubmit";
import { SecureForm } from "./SecureForm";
import { SuccessMessage } from "./SuccessMessage";
import { AlreadyClaimedMessage } from "./AlreadyClaimedMessage";
import { CreatorDealAction } from "@/components/creators/CreatorDealAction";

interface SecureDealContainerProps {
  dealId: number;
  dealTitle: string;
  onSuccess?: () => void;
  bookingUrl?: string | null;
  requiresDiscountCode?: boolean;
  salonId?: number;
}

export const SecureDealContainer = ({ 
  dealId, 
  dealTitle,
  onSuccess,
  bookingUrl,
  requiresDiscountCode = true,
  salonId
}: SecureDealContainerProps) => {
  // Check if user has already claimed this deal
  const { hasAlreadyClaimed, isCheckingClaim } = useClaimCheck(dealId);
  
  // Handle form submission and code generation
  const {
    isSubmitting,
    isSuccess,
    emailSent,
    discountCode,
    emailError,
    handleSubmit,
    handleReset
  } = useSecureDealSubmit({
    dealId,
    dealTitle,
    onSuccess,
    hasAlreadyClaimed,
    requiresDiscountCode,
    bookingUrl
  });

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
      {/* Visa kreatörskomponenten först om salonId finns */}
      {salonId && <CreatorDealAction dealId={dealId} dealTitle={dealTitle} salonId={salonId} />}
      
      {hasAlreadyClaimed ? (
        <AlreadyClaimedMessage onGoBack={handleGoBack} />
      ) : isSuccess ? (
        <SuccessMessage 
          onReset={handleReset} 
          email={emailSent || ''} 
          code={discountCode}
          emailError={emailError}
        />
      ) : (
        <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
};
