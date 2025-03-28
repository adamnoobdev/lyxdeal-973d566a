
import React from 'react';
import { Helmet } from 'react-helmet';

const FaqPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Helmet>
        <title>Vanliga frågor | Lyxdeal</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">Vanliga frågor</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Hur fungerar Lyxdeal?</h2>
          <p className="text-gray-700">
            Lyxdeal erbjuder exklusiva erbjudanden från kvalitetssalonger. 
            Du väljer ett erbjudande, säkrar det och får en rabattkod via e-post 
            som du sedan visar upp i salongen.
          </p>
        </div>
        {/* Fler FAQ-frågor kommer här */}
      </div>
    </div>
  );
};

export default FaqPage;
