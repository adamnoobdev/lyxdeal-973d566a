
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Store } from "lucide-react";
import { SalonLoginForm } from "@/components/salon/LoginForm";
import { toast } from "sonner";

export default function SalonLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till startsidan
        </Button>

        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Salongsinloggning</h1>
            <p className="text-gray-600 mb-4">
              Denna inloggning är endast för salongspartners.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <p className="text-sm text-green-800">
                Vill du bli salongspartner? <a href="/bli-partner" className="font-medium underline">Registrera dig här</a> och få en gratis provmånad med kod <span className="font-bold">provmanad</span>!
              </p>
            </div>
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
