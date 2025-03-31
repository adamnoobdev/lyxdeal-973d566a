
import React from 'react';
import { SalonLoginForm } from '@/components/salon/LoginForm';
import { PartnerRegistrationCTA } from './PartnerRegistrationCTA';

export const LoginCard: React.FC = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <SalonLoginForm />
      <PartnerRegistrationCTA />
    </div>
  );
};
