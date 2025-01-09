import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealForm } from "@/components/DealForm";
import { toast } from "sonner";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Lock, LogOut, Plus } from "lucide-react";

// I praktiken skulle detta hanteras säkrare, t.ex. genom en backend
const ADMIN_PASSWORD = "admin123";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  originalPrice: z.string(),
  discountedPrice: z.string(),
  category: z.string(),
  city: z.string(),
  timeRemaining: z.string(),
  featured: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('deals').insert({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: parseInt(values.originalPrice),
        discounted_price: parseInt(values.discountedPrice),
        category: values.category,
        city: values.city,
        time_remaining: values.timeRemaining,
        featured: values.featured,
      });

      if (error) throw error;

      toast.success("Erbjudandet har skapats! 🎉");
      navigate("/");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Något gick fel när erbjudandet skulle skapas 😔");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Välkommen tillbaka! 👋");
    } else {
      toast.error("Fel lösenord! 🔒");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" />
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Ange lösenord för att få tillgång till admin-panelen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
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
    <div className="container mx-auto p-6 animate-fade-up">
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Plus className="h-6 w-6" />
                Lägg till nytt erbjudande
              </CardTitle>
              <CardDescription>
                Skapa ett nytt erbjudande som kommer att visas på hemsidan
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
                toast.success("Du har loggats ut! 👋");
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logga ut
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <DealForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}