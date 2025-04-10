
import React, { useEffect } from 'react';
import { SecureForm } from './secure-deal/SecureForm';
import { useSecureDealSubmit } from '@/hooks/useSecureDealSubmit';
import { useClaimCheck } from '@/hooks/useClaimCheck';
import { AlreadyClaimedMessage } from './secure-deal/AlreadyClaimedMessage';
import { SuccessMessage } from './secure-deal/SuccessMessage';

export interface SecureDealFormProps {
  dealId: number;
  dealTitle: string;
  onSuccess: () => void;
  requiresDiscountCode?: boolean;
  bookingUrl?: string | null;
}

export const SecureDealForm: React.FC<SecureDealFormProps> = ({
  dealId,
  dealTitle,
  onSuccess,
  requiresDiscountCode = true,
  bookingUrl
}) => {
  console.log(`[SecureDealForm] Initialized with dealId=${dealId}, requiresDiscountCode=${requiresDiscountCode}, bookingUrl=${bookingUrl}`);
  
  const { hasAlreadyClaimed, isCheckingClaim } = useClaimCheck(dealId);
  
  useEffect(() => {
    console.log(`[SecureDealForm] hasAlreadyClaimed=${hasAlreadyClaimed}, isCheckingClaim=${isCheckingClaim}`);
  }, [hasAlreadyClaimed, isCheckingClaim]);
  
  const {
    isSubmitting,
    isSuccess,
    emailSent,
    discountCode,
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

  const handleGoBack = () => {
    window.history.back();
  };

  useEffect(() => {
    console.log(`[SecureDealForm] State updated: isSubmitting=${isSubmitting}, isSuccess=${isSuccess}, emailSent=${emailSent}, discountCode=${discountCode}`);
  }, [isSubmitting, isSuccess, emailSent, discountCode]);

  if (isCheckingClaim) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (isSuccess && emailSent) {
    console.log(`[SecureDealForm] Showing success message with email=${emailSent} and code=${discountCode}`);
    return (
      <SuccessMessage 
        email={emailSent} 
        code={discountCode} 
        onReset={handleReset}
      />
    );
  }

  if (hasAlreadyClaimed) {
    console.log(`[SecureDealForm] User has already claimed this deal, showing message`);
    return <AlreadyClaimedMessage onGoBack={handleGoBack} />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};
