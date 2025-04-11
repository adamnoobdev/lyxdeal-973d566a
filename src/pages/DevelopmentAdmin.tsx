
import React from 'react';
import { FeatureFlagAdmin } from '@/components/development/FeatureFlagAdmin';
import { useEnvironmentDetection } from '@/hooks/auth/useEnvironmentDetection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DevelopmentAdmin: React.FC = () => {
  const { isSandboxEnvironment } = useEnvironmentDetection();
  const navigate = useNavigate();
  
  // Endast tillgänglig i utvecklingsmiljö
  if (!isSandboxEnvironment()) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Utvecklingsadmin</h1>
        <p className="mb-4">Denna sida är endast tillgänglig i utvecklingsmiljö.</p>
        <Button onClick={() => navigate('/')}>Tillbaka till startsidan</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Utvecklingsadmin</h1>
        <Button variant="outline" onClick={() => navigate('/')}>Tillbaka till startsidan</Button>
      </div>
      
      <FeatureFlagAdmin userIsAdmin={true} />
    </div>
  );
};

export default DevelopmentAdmin;
