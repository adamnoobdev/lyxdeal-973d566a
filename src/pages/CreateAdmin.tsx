
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Helmet } from "react-helmet";

export default function CreateAdmin() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{admin?: any, temporaryPassword?: string, error?: string} | null>(null);

  const createAdmin = async () => {
    setLoading(true);
    try {
      const email = "hugo@sparbarlead.se"; // Den specifika e-postadressen som ska läggas till
      const name = "Hugo"; // Namn för admin-användaren
      
      toast.info("Skapar admin-användare...");
      
      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: { email, name }
      });
      
      if (error) throw error;
      
      setResult(data);
      toast.success("Admin-användare skapades framgångsrikt!");
    } catch (error) {
      console.error("Fel vid skapande av admin:", error);
      setResult({ error: error instanceof Error ? error.message : "Ett oväntat fel uppstod" });
      toast.error("Kunde inte skapa admin-användare");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Kör automatiskt när komponenten laddas
    createAdmin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Helmet>
        <title>Skapa Admin - Lyxdeal</title>
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Skapa Admin-användare</CardTitle>
          <CardDescription>
            Detta verktyg skapar en admin-användare med e-postadressen hugo@sparbarlead.se
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Skapar admin-användare...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {result.error ? (
                <div className="p-4 bg-red-50 text-red-800 rounded-md">
                  <p className="font-semibold">Ett fel uppstod:</p>
                  <p>{result.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 text-green-800 rounded-md">
                    <p className="font-semibold">Admin-användare skapades framgångsrikt!</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p><span className="font-semibold">E-post:</span> {result.admin?.email}</p>
                    <p><span className="font-semibold">Namn:</span> {result.admin?.name}</p>
                    <p><span className="font-semibold">Roll:</span> {result.admin?.role}</p>
                    <p><span className="font-semibold">Temporärt lösenord:</span> {result.temporaryPassword}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-md text-yellow-800">
                    <p className="font-semibold">Viktigt!</p>
                    <p>Notera lösenordet ovan. Det kommer inte att visas igen.</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
            className="w-full"
          >
            Gå till startsidan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
