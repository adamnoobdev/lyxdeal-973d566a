
import React from "react";
import { SalonLocationMap } from "./map";

interface ProductSalonInfoProps {
  salonId: number | null;
  salonName: string | null;
  city: string;
}

export const ProductSalonInfo = ({ salonId, salonName, city }: ProductSalonInfoProps) => {
  return (
    <div className="bg-white shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Om {salonName || `salongen i ${city}`}</h2>
      
      <div className="mt-6">
        <SalonLocationMap 
          salonId={salonId} 
          city={city} 
        />
      </div>
    </div>
  );
};
