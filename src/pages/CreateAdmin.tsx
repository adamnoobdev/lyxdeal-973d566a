
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AdminAuthCheck } from '@/components/admin/auth/AdminAuthCheck';
import { toast } from "sonner";

// Schema för formuläret
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Namn måste vara minst 2 tecken.",
  }),
  email: z.string().email({
    message: "Ange en giltig e-postadress.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateAdmin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    salon: any;
    temporaryPassword: string;
  } | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Du måste vara inloggad för att skapa en administratör");
        navigate('/salon/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: values,
      });

      if (error) {
        toast.error(`Ett fel uppstod: ${error.message}`);
        return;
      }

      if (data.error) {
        toast.error(`Ett fel uppstod: ${data.error}`);
        return;
      }

      toast.success("Administratör skapad framgångsrikt!");
      setResult(data);
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("Ett fel uppstod när administratören skulle skapas");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminAuthCheck>
      <div className="container max-w-md py-6 md:py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Skapa ny administratör</CardTitle>
            <CardDescription>
              Skapa en ny administratör som kan hantera systemet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Namn</FormLabel>
                        <FormControl>
                          <Input placeholder="Företagsnamn eller personnamn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-post</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="E-postadress" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon (valfritt)</FormLabel>
                        <FormControl>
                          <Input placeholder="Telefonnummer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adress (valfritt)</FormLabel>
                        <FormControl>
                          <Input placeholder="Fullständig adress" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? "Skapar..." : "Skapa administratör"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Administratör skapad!</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Namn: {result.salon.name}</p>
                        <p>E-post: {result.salon.email}</p>
                        <p className="font-semibold mt-2">Tillfälligt lösenord:</p>
                        <p className="p-2 bg-gray-100 rounded font-mono text-sm break-all">{result.temporaryPassword}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-amber-600 text-sm">
                  OBS! Spara detta lösenord! Det visas bara en gång.
                </p>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button 
                    onClick={() => {
                      setResult(null);
                      form.reset();
                    }}
                    className="w-full"
                  >
                    Skapa en till administratör
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    className="w-full"
                  >
                    Återgå till dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminAuthCheck>
  );
}
