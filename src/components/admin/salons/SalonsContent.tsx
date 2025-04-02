
import { Salon } from "../types";
import { SalonsTable } from "./SalonsTable";
import { SalonDetails } from "./SalonDetails";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // För mobila enheter, visa detaljer när en salong är vald
  useEffect(() => {
    if (selectedSalon && isMobile) {
      setShowDetails(true);
    }
  }, [selectedSalon, isMobile]);

  const handleBackToList = () => {
    setShowDetails(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Visa tabellen när inga detaljer visas eller på större skärmar */}
      {(!showDetails || !isMobile) && (
        <div className={`${!isMobile && selectedSalon ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg font-semibold">Salonger</h2>
            </div>
            <div className="p-0 sm:p-4 overflow-auto">
              <SalonsTable
                salons={salons}
                onEdit={onEdit}
                onDelete={onDelete}
                onSelect={(salon) => {
                  onSelect(salon);
                  if (isMobile) {
                    setShowDetails(true);
                  }
                }}
                selectedSalon={selectedSalon}
              />
            </div>
          </div>
        </div>
      )}

      {/* Visa detaljer i mobilläge eller i sidopanel på större skärmar */}
      {selectedSalon && (isMobile ? showDetails : true) && (
        <div className="lg:col-span-1">
          {isMobile && showDetails && (
            <Button 
              onClick={handleBackToList}
              variant="ghost" 
              size="sm"
              className="mb-2 text-xs text-primary flex items-center gap-1 px-2 py-1 h-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Tillbaka till listan</span>
            </Button>
          )}
          <SalonDetails salon={selectedSalon} />
        </div>
      )}

      {!selectedSalon && !isMobile && (
        <div className="lg:col-span-1 hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-muted-foreground text-sm">
              Välj en salong för att se detaljer
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
