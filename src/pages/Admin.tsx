import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DealForm } from "@/components/DealForm";
import { DealsList } from "@/components/admin/DealsList";
import { toast } from "sonner";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Lock, LogOut, Plus, List, LayoutDashboard, Store, Tag } from "lucide-react";
import { SalonsList } from "@/components/admin/salons/SalonsList";
import { useSession } from "@/hooks/useSession";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  salon_id: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [currentSalon, setCurrentSalon] = useState<{ id: number } | null>(null);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      toast.error("Du måste vara inloggad för att komma åt admin-sidan");
      return;
    }

    const checkCurrentUser = async () => {
      const { data: salon } = await supabase
        .from('salons')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      
      if (salon) {
        setCurrentSalon(salon);
      }
    };

    checkCurrentUser();
  }, [session, navigate]);

  const handleSubmit = async (values: FormValues) => {
    if (!session) {
      toast.error("Du måste vara inloggad för att skapa erbjudanden");
      return;
    }

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
        salon_id: currentSalon?.id,
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

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Du måste vara inloggad för att komma åt admin-sidan
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <LayoutDashboard className="h-8 w-8 text-primary" />
                Admin Dashboard
              </CardTitle>
              <CardDescription className="text-lg">
                Hantera erbjudanden och salonger
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
                toast.success("Du har loggats ut! 👋");
              }}
              className="flex items-center gap-2 hover:bg-destructive hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logga ut
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-6">
          <Tabs defaultValue="deals" className="space-y-6">
            <TabsList className="w-full justify-start bg-muted/50 p-1">
              <TabsTrigger value="deals" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Tag className="h-4 w-4" />
                Erbjudanden
              </TabsTrigger>
              <TabsTrigger value="salons" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Store className="h-4 w-4" />
                Salonger
              </TabsTrigger>
            </TabsList>
            <TabsContent value="deals" className="space-y-6">
              <Tabs defaultValue="list" className="space-y-6">
                <TabsList className="w-full justify-start bg-muted/50 p-1">
                  <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <List className="h-4 w-4" />
                    Lista erbjudanden
                  </TabsTrigger>
                  <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <Plus className="h-4 w-4" />
                    Skapa erbjudande
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                  <Card>
                    <CardContent className="p-6">
                      <DealsList />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="create">
                  <Card>
                    <CardContent className="p-6">
                      <DealForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="salons">
              <Card>
                <CardContent className="p-6">
                  <SalonsList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
