
import React from 'react';
import { Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginHeader: React.FC = () => {
  return (
    <div className="mb-8 text-center">
      <div className="flex justify-center mb-4">
        <Store className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Salongsinloggning</h1>
      <p className="text-gray-600 mb-4">
        Denna inloggning är endast för salongspartners.
      </p>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
        <p className="text-sm text-green-800">
          Vill du bli salongspartner? <Link to="/bli-partner" className="font-medium underline">Registrera dig här</Link> och få en gratis provmånad med kod <span className="font-bold">provmanad</span>!
        </p>
      </div>
    </div>
  );
};
