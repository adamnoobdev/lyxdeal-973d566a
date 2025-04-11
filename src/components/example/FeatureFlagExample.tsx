
import React from 'react';
import { ProtectedFeature } from '../development/ProtectedFeature';
import { ExperimentalFeatureBadge } from '../development/ExperimentalFeatureBadge';

export const FeatureFlagExample: React.FC = () => {
  const FLAG_NAME = "NEW_DISCOUNT_SYSTEM";
  
  return (
    <div className="p-4 border rounded">
      <ExperimentalFeatureBadge 
        flagName={FLAG_NAME} 
        message="Nytt rabattsystem under utveckling"
      />
      
      <h2 className="text-xl font-bold">Rabattkoder</h2>
      
      <ProtectedFeature
        flagName={FLAG_NAME}
        fallback={<p>Standard rabattkodsystem</p>}
      >
        <p>Nytt förbättrat rabattkodsystem med ny validering</p>
      </ProtectedFeature>
    </div>
  );
};
