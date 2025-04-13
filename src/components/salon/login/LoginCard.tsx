
import React, { useState } from 'react';
import { SalonLoginForm } from '@/components/salon/LoginForm';
import { PartnerRegistrationCTA } from './PartnerRegistrationCTA';
import { PasswordResetForm } from './PasswordResetForm';

interface LoginCardProps {
  showResetForm?: boolean;
}

export const LoginCard: React.FC<LoginCardProps> = ({ showResetForm = false }) => {
  const [showPasswordReset, setShowPasswordReset] = useState(showResetForm);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {showPasswordReset ? (
        <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
      ) : (
        <>
          <SalonLoginForm onForgotPassword={() => setShowPasswordReset(true)} />
          <PartnerRegistrationCTA />
        </>
      )}
    </div>
  );
};
