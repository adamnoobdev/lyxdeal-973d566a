
import React, { useState } from 'react';
import { SalonLoginForm } from '@/components/salon/LoginForm';
import { PartnerRegistrationCTA } from './PartnerRegistrationCTA';
import { PasswordResetForm } from './PasswordResetForm';

export const LoginCard: React.FC = () => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);

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
