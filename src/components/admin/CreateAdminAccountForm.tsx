
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CreateAdminAccountForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Vänligen fyll i både e-post och lösenord");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-account', {
        body: { email, password, name }
      });
      
      if (error) {
        console.error("Error creating admin account:", error);
        setError(error.message || "Ett fel uppstod vid skapande av admin-konto");
        toast.error("Kunde inte skapa admin-konto");
        return;
      }
      
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
        return;
      }
      
      setSuccess(true);
      toast.success("Admin-konto skapat framgångsrikt!");
      
      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/salon/login");
      }, 2000);
      
    } catch (err) {
      console.error("Exception creating admin account:", err);
      setError("Ett oväntat fel uppstod");
      toast.error("Ett oväntat fel uppstod");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Skapa ett admin-konto</CardTitle>
      </CardHeader>
      
      <CardContent>
        {success ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-center">Admin-konto skapat framgångsrikt! Du kommer att bli omdirigerad till inloggningssidan...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-post <span className="text-red-500">*</span></Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord <span className="text-red-500">*</span></Label>
              <Input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minst 6 tecken"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">Lösenordet måste vara minst 6 tecken långt.</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Skapar konto..." : "Skapa admin-konto"}
            </Button>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-xs text-gray-500 text-center">
          Detta admin-konto kommer att ha fullständig åtkomst till Lyxdeal-plattformen.
        </p>
      </CardFooter>
    </Card>
  );
};
