
import { useState, useEffect } from "react";
import { Salon } from "../types";
import { useSalonsAdmin } from "@/hooks/useSalonsAdmin";
import { EditSalonDialog } from "./EditSalonDialog";
import { DeleteSalonDialog } from "./DeleteSalonDialog";
import { CreateSalonDialog } from "./CreateSalonDialog";
import { SalonsLoadingSkeleton } from "./SalonsLoadingSkeleton";
import { SalonsHeader } from "./SalonsHeader";
import { SalonsContent } from "./SalonsContent";

/**
 * Komponent för att lista och hantera salonger i administratörsgränssnittet
 */
export const SalonsList = () => {
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [deletingSalon, setDeletingSalon] = useState<Salon | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { salons, isLoading, error, handleDelete, handleUpdate, handleCreate, fetchSalons } = useSalonsAdmin();

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

  /**
   * Hantera borttagning av en salong
   */
  const onDelete = async () => {
    if (deletingSalon) {
      const success = await handleDelete(deletingSalon.id);
      if (success) {
        setDeletingSalon(null);
        if (selectedSalon?.id === deletingSalon.id) {
          setSelectedSalon(null);
        }
      }
    }
  };

  /**
   * Hantera uppdatering av en salong
   */
  const onUpdate = async (values: any) => {
    if (editingSalon) {
      const success = await handleUpdate(values, editingSalon.id);
      if (success) {
        setEditingSalon(null);
      }
    }
  };

  /**
   * Hantera skapande av en ny salong
   */
  const onCreate = async (values: any) => {
    const response = await handleCreate(values);
    return response;
  };

  /**
   * Dela upp adressfält för redigering
   */
  const getInitialValuesForEdit = (salon: Salon) => {
    const initialValues = {
      name: salon.name,
      email: salon.email,
      phone: salon.phone || "",
      street: "",
      postalCode: "",
      city: "",
      termsAccepted: salon.terms_accepted !== false,
      privacyAccepted: salon.privacy_accepted !== false,
    };

    // Tolka adress om den finns
    if (salon.address) {
      const addressParts = salon.address.split(',');
      
      // Hämta gata från första delen
      if (addressParts.length > 0) {
        initialValues.street = addressParts[0].trim();
        
        // Hämta postnummer och stad från andra delen
        if (addressParts.length > 1) {
          const secondPart = addressParts[1].trim();
          
          // Försök hitta postnummer (5 siffror med valfritt mellanslag efter 3 siffror)
          const postalCodeMatch = secondPart.match(/\b(\d{3}\s?\d{2})\b/);
          
          if (postalCodeMatch) {
            initialValues.postalCode = postalCodeMatch[1];
            
            // Staden är resten av texten efter postnumret
            const cityText = secondPart.replace(postalCodeMatch[1], '').trim();
            initialValues.city = cityText;
          } else {
            // Om inget postnummer hittades, anta att det är hela staden
            initialValues.city = secondPart;
          }
        }
      }
    }
    
    return initialValues;
  };

  if (isLoading) {
    return <SalonsLoadingSkeleton />;
  }

  // Eftersom error redan är string eller null i useSalonsAdmin behöver vi inte kolla instanceof
  const errorMessage = error || null;

  return (
    <div className="space-y-6">
      <SalonsHeader 
        error={errorMessage} 
        onCreateClick={() => setIsCreating(true)} 
      />

      {salons && (
        <SalonsContent
          salons={salons}
          selectedSalon={selectedSalon}
          onEdit={setEditingSalon}
          onDelete={setDeletingSalon}
          onSelect={setSelectedSalon}
        />
      )}

      <EditSalonDialog
        isOpen={!!editingSalon}
        onClose={() => setEditingSalon(null)}
        onSubmit={onUpdate}
        initialValues={editingSalon ? getInitialValuesForEdit(editingSalon) : undefined}
      />

      <DeleteSalonDialog
        isOpen={!!deletingSalon}
        onClose={() => setDeletingSalon(null)}
        onConfirm={onDelete}
        salonName={deletingSalon?.name}
      />

      <CreateSalonDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={onCreate}
      />
    </div>
  );
};
