
import { Salon } from "../types";
import { SalonsTable } from "./SalonsTable";
import { SalonDetails } from "./SalonDetails";
import { useState, useEffect } from "react";

interface SalonsContentProps {
  salons: Salon[];
  selectedSalon: Salon | null;
  onEdit: (salon: Salon) => void;
  onDelete: (salon: Salon) => void;
  onSelect: (salon: Salon) => void;
}

export const SalonsContent = ({
  salons,
  selectedSalon,
  onEdit,
  onDelete,
  onSelect,
}: SalonsContentProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className={`${isMobile || !selectedSalon ? 'xl:col-span-3' : 'xl:col-span-2'}`}>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Salonger</h2>
          </div>
          <div className="p-4 overflow-auto">
            <SalonsTable
              salons={salons}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
              selectedSalonId={selectedSalon?.id}
            />
          </div>
        </div>
      </div>

      {(selectedSalon && (!isMobile || (isMobile && selectedSalon))) && (
        <div className="xl:col-span-1">
          <SalonDetails salon={selectedSalon} />
        </div>
      )}

      {!selectedSalon && !isMobile && (
        <div className="xl:col-span-1 hidden xl:block">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-muted-foreground">
              Välj en salong för att se detaljer
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
