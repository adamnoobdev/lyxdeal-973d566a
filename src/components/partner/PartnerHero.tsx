
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const PartnerHero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary-50 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Väx din salong med <span className="text-primary">Lyxdeal</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Bli partner med Lyxdeal och få nya kunder, öka synligheten för din salong 
            och maximera din försäljning med ett enkelt och flexibelt system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-base px-8 py-6"
              onClick={() => {
                // Scroll to contact form
                document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Bli partner idag
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base px-8 py-6"
              onClick={() => navigate('/salon/login')}
            >
              Logga in
            </Button>
          </div>
          
          <div className="mt-10 text-sm text-gray-500">
            Redan över 200 salonger använder Lyxdeal för att växa sin verksamhet
          </div>
        </div>
      </div>
    </section>
  );
};
