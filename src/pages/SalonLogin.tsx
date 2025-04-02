
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoginHeader } from '@/components/salon/login/LoginHeader';
import { LoginCard } from '@/components/salon/login/LoginCard';
import { Helmet } from 'react-helmet';

export default function SalonLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Salongspartners Inloggning | Lyxdeal</title>
        <meta name="description" content="Logga in på ditt salongspartner-konto för att hantera erbjudanden, kunder och prenumerationer." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till startsidan
        </Button>

        <div className="max-w-md mx-auto">
          <LoginHeader />
          <LoginCard />
        </div>
      </div>
    </div>
  );
}
