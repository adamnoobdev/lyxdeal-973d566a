
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Rating } from "@/components/ui/rating";

interface ProductSalonInfoProps {
  salonId: number | null;
  salonName: string | undefined;
  city: string;
  salonRating?: number;
}

export const ProductSalonInfo = ({ 
  salonId, 
  salonName, 
  city, 
  salonRating 
}: ProductSalonInfoProps) => {
  if (!salonId) return null;

  return (
    <section className="bg-white p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Om salongen</h2>
      
      <div className="flex flex-col space-y-3">
        <div>
          <h3 className="font-medium text-lg">{salonName}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{city}</span>
          </div>
          
          {salonRating !== undefined && (
            <div className="mt-2">
              <Rating value={salonRating} size="md" />
              <p className="text-sm text-muted-foreground mt-1">
                Detta är salongens kvalitetsomdöme baserat på kundbedömningar
              </p>
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to={`/salon/${salonId}`}>
              Se mer om salongen
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
