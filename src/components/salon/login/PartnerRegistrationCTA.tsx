
import React from 'react';
import { Link } from 'react-router-dom';

export const PartnerRegistrationCTA: React.FC = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-base font-medium text-gray-900 mb-2">Inte registrerad ännu?</h3>
      <p className="text-sm text-gray-600 mb-4">
        Bli partner med Lyxdeal och nå ut till tusentals nya kunder.
      </p>
      <Link
        to="/partner"
        className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-md transition-colors text-sm font-medium"
      >
        Läs mer om att bli partner
      </Link>
    </div>
  );
};
