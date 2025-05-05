
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageMetadata } from '@/components/seo/PageMetadata';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetadata
        title="Sidan hittades inte | Lyxdeal"
        description="Vi kunde inte hitta sidan du söker. Utforska våra skönhetserbjudanden istället."
        canonicalPath="/404"
      />
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 shadow-md rounded-lg text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sidan hittades inte</h2>
          <p className="text-gray-600 mb-8">
            Vi kunde inte hitta sidan du söker. Den kan ha tagits bort eller så har du angivit fel adress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              className="w-full sm:w-auto"
            >
              Gå tillbaka
            </Button>
            <Button 
              asChild
              className="w-full sm:w-auto"
            >
              <Link to="/">Till startsidan</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
