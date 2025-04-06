
import React from "react";
import { MapPin, Phone } from "lucide-react";
import { Rating } from "@/components/ui/rating";

interface ProductSalonInfoProps {
  salonId: number | null;
  salonName: string | undefined;
  city: string;
  salonRating?: number;
  phone?: string | null;
}

export const ProductSalonInfo = ({ 
  salonId, 
  salonName, 
  city, 
  salonRating,
  phone 
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
          
          {phone && (
            <div className="flex items-center space-x-2 mt-1">
              <Phone className="h-4 w-4 text-gray-500" />
              <a href={`tel:${phone}`} className="text-gray-600 hover:text-primary hover:underline">{phone}</a>
            </div>
          )}
          
          {salonRating !== undefined && (
            <div className="mt-2">
              <Rating value={salonRating} size="md" showValue={true} />
              <p className="text-sm text-muted-foreground mt-1">
                Detta är salongens kvalitetsomdöme baserat på kundbedömningar
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
