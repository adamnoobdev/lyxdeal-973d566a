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
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full">
        <SalonsTable
          salons={salons}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      </div>

      {selectedSalon && (
        <div className="w-full lg:w-1/3 lg:border-l lg:pl-6">
          <SalonDetails salon={selectedSalon} />
        </div>
      )}
    </div>
  );
};