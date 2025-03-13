
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { SalonLoginForm } from "@/components/salon/LoginForm";
import { toast } from "sonner";

export default function SalonLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till startsidan
        </Button>

        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Salongsinloggning</h1>
            <p className="text-gray-600">
              Logga in för att hantera dina erbjudanden
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <SalonLoginForm />
            
            <div className="mt-6 border-t pt-6">
              <p className="text-center text-sm text-gray-600 mb-4">
                Har du inte ett konto än?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/bli-partner")}
              >
                Bli partner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
