
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const DealPage: React.FC = () => {
  const { dealId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Erbjudande | Lyxdeal</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Erbjudande {dealId}</h1>
      <p>Detaljer om erbjudandet kommer här.</p>
    </div>
  );
};

export default DealPage;
