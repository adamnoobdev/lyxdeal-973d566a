
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const PartnerRegistrationCTA: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-6 border-t pt-6">
      <p className="text-center text-sm text-gray-600 mb-4">
        Har du inte ett konto än?
      </p>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => navigate("/bli-partner")}
      >
        Bli partner
      </Button>
    </div>
  );
};
