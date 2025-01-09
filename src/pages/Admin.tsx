import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// I praktiken skulle detta hanteras säkrare, t.ex. genom en backend
const ADMIN_PASSWORD = "admin123";

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Inloggningen lyckades! 🔓");
    } else {
      toast.error("Fel lösenord! 🔒");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">🔐 Admin-inloggning</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Ange lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Logga in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="outline"
          onClick={() => {
            setIsAuthenticated(false);
            setPassword("");
          }}
        >
          Logga ut 🚪
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/manage-deals">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Hantera Erbjudanden</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Skapa, redigera och ta bort erbjudanden
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/new-deal">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Skapa Nytt Erbjudande</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Lägg till ett nytt erbjudande i systemet
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}