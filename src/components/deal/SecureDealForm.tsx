
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
  const { hasAlreadyClaimed, isCheckingClaim } = useClaimCheck(dealId);
  
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

  const handleGoBack = () => {
    window.history.back();
  };

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
    return (
      <SuccessMessage 
        email={emailSent} 
        code={discountCode} 
        onReset={handleReset}
        emailError={emailError}
      />
    );
  }

  if (hasAlreadyClaimed) {
    return <AlreadyClaimedMessage onGoBack={handleGoBack} />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};
