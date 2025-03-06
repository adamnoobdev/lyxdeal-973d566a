
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";

export const ContactSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Har du frågor?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kontakta oss gärna om du har frågor om att bli salongspartner eller om du vill ha mer information om våra paket.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Namn</label>
                    <Input id="name" placeholder="Ditt namn" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="business" className="text-sm font-medium">Företagsnamn</label>
                    <Input id="business" placeholder="Ditt företag" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">E-post</label>
                    <Input id="email" type="email" placeholder="din@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Telefon</label>
                    <Input id="phone" placeholder="Ditt telefonnummer" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Meddelande</label>
                  <Textarea id="message" placeholder="Skriv ditt meddelande här..." rows={5} />
                </div>
                <Button type="submit" className="w-full">Skicka meddelande</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
