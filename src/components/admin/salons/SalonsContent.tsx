
import { Salon } from "../types";
import { SalonsTable } from "./SalonsTable";
import { SalonDetails } from "./SalonDetails";

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
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-slate-50/80">
            <h2 className="text-lg font-semibold text-gray-800">Salonger</h2>
          </div>
          <div className="p-4">
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

      <div className="xl:col-span-1">
        {selectedSalon ? (
          <SalonDetails salon={selectedSalon} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <p className="text-muted-foreground">
              Välj en salong för att se detaljer
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
