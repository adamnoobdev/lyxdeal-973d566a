
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UpdatePasswordForm } from '@/components/salon/UpdatePasswordForm';

export default function UpdatePassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/salon/login")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till inloggningssidan
        </Button>

        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Uppdatera lösenord</h2>
            <p className="text-muted-foreground mt-2">Skapa ett nytt lösenord för att återfå åtkomst till ditt konto</p>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <UpdatePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
