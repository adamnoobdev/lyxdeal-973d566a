
import React from 'react';
import { Helmet } from 'react-helmet';

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Lyxdeal - Exklusiva skönhetserbjudanden</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Välkommen till Lyxdeal</h1>
      <p>Här hittar du exklusiva skönhetserbjudanden från de bästa salongerna.</p>
    </div>
  );
};

export default LandingPage;
