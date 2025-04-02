
import React from 'react';
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
  const { hasAlreadyClaimed } = useClaimCheck(dealId);
  
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

  if (isSuccess && emailSent) {
    return (
      <SuccessMessage 
        email={emailSent} 
        code={discountCode} 
        onReset={handleReset}
      />
    );
  }

  if (hasAlreadyClaimed) {
    return <AlreadyClaimedMessage />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6">Säkra ditt erbjudande</h2>
      <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};
