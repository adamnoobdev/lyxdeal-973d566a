
import React from 'react';
import { Helmet } from 'react-helmet';

const LoginPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Helmet>
        <title>Logga in | Lyxdeal</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6 text-center">Logga in</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Inloggningsformulär kommer här.</p>
      </div>
    </div>
  );
};

export default LoginPage;
