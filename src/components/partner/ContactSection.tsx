
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export const ContactSection = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, we would handle form submission
    // For now, we'll just navigate to the login page
    navigate('/salon/login');
  };
  
  return (
    <section id="contact-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ta steget idag</h2>
          <p className="text-gray-600 text-lg">
            Fyll i formuläret nedan så kontaktar vi dig för att diskutera hur vi kan hjälpa din salong att växa.
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Namn</Label>
                  <Input id="name" placeholder="Ditt namn" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salon-name">Salongsnamn</Label>
                  <Input id="salon-name" placeholder="Din salongs namn" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-post</Label>
                  <Input id="email" type="email" placeholder="din@epost.se" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" placeholder="Ditt telefonnummer" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Meddelande</Label>
                <Textarea 
                  id="message" 
                  placeholder="Berätta lite om din salong och vad du är intresserad av..."
                  className="min-h-32"
                />
              </div>
              
              <div className="text-sm text-gray-500">
                Genom att skicka godkänner du att vi kontaktar dig om våra tjänster. 
                Vi respekterar din integritet och delar aldrig dina uppgifter.
                Se vår <a href="/privacy" className="text-primary hover:underline">integritetspolicy</a> för mer information.
              </div>
              
              <Button type="submit" className="w-full py-6" size="lg">
                Skicka förfrågan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
