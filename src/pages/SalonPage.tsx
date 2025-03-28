
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const SalonPage: React.FC = () => {
  const { salonId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Salong | Lyxdeal</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Salong {salonId}</h1>
      <p>Information om salongen kommer här.</p>
    </div>
  );
};

export default SalonPage;
