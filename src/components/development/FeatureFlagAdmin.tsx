
import React from 'react';
import { useFeatureFlags } from '@/hooks/useFeatureFlag';
import featureFlags from '@/config/featureFlags';
import { useEnvironmentDetection } from '@/hooks/auth/useEnvironmentDetection';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface FeatureFlagAdminProps {
  userIsAdmin?: boolean;
}

export const FeatureFlagAdmin: React.FC<FeatureFlagAdminProps> = ({ 
  userIsAdmin = false
}) => {
  const { flags, toggleFeatureFlag } = useFeatureFlags(userIsAdmin);
  const { isSandboxEnvironment } = useEnvironmentDetection();
  
  if (!isSandboxEnvironment()) {
    return null;
  }
  
  const resetAllFlags = () => {
    Object.keys(featureFlags).forEach(key => {
      localStorage.removeItem(`feature_${key}`);
    });
    window.location.reload();
  };
  
  return (
    <div className="p-4 rounded-lg border bg-white shadow-md max-w-4xl mx-auto my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feature Flag Admin</h2>
          <p className="text-gray-500">Aktivera/avaktivera funktioner i utvecklingsmiljön</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={resetAllFlags}
          className="text-sm"
        >
          Återställ alla
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Funktion</TableHead>
            <TableHead>Beskrivning</TableHead>
            <TableHead className="w-[100px] text-center">Admin Only</TableHead>
            <TableHead className="w-[150px] text-center">Status</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(featureFlags).map(([key, flag]) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{key}</TableCell>
              <TableCell>{flag.description}</TableCell>
              <TableCell className="text-center">
                {flag.isAdminOnly ? '✓' : '-'}
              </TableCell>
              <TableCell className="text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${flags[key] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {flags[key] ? 'Aktiv' : 'Inaktiv'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Switch 
                    checked={flags[key] || false}
                    onCheckedChange={() => toggleFeatureFlag(key)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 bg-gray-50 p-4 rounded border text-sm text-gray-600">
        <p className="font-semibold mb-2">OBS: Detta är ett utvecklingsverktyg</p>
        <p>Feature flags i denna panel påverkar endast din lokala session och är endast tillgängliga i utvecklingsmiljö.</p>
      </div>
    </div>
  );
};
