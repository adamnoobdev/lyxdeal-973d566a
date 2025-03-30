
import { useState, useEffect } from "react";
import { Salon } from "../types";
import { useSalonsAdmin } from "@/hooks/useSalonsAdmin";
import { EditSalonDialog } from "./EditSalonDialog";
import { DeleteSalonDialog } from "./DeleteSalonDialog";
import { CreateSalonDialog } from "./CreateSalonDialog";
import { SalonsLoadingSkeleton } from "./SalonsLoadingSkeleton";
import { SalonsHeader } from "./SalonsHeader";
import { SalonsContent } from "./SalonsContent";

export const SalonsList = () => {
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [deletingSalon, setDeletingSalon] = useState<Salon | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { salons, isLoading, error, handleDelete, handleUpdate, handleCreate, fetchSalons } = useSalonsAdmin();

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

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

  const onUpdate = async (values: any) => {
    if (editingSalon) {
      const success = await handleUpdate(values, editingSalon.id);
      if (success) {
        setEditingSalon(null);
      }
    }
  };

  const onCreate = async (values: any) => {
    const response = await handleCreate(values);
    return response;
  };

  // Parse address into components for editing
  const getInitialValuesForEdit = (salon: Salon) => {
    const initialValues = {
      name: salon.name,
      email: salon.email,
      phone: salon.phone || "",
      street: "",
      postalCode: "",
      city: "",
      termsAccepted: salon.terms_accepted !== false, // Om undefined eller true, sätt true som standard
      privacyAccepted: salon.privacy_accepted !== false, // Om undefined eller true, sätt true som standard
    };

    // Parse address if it exists
    if (salon.address) {
      const addressParts = salon.address.split(',');
      
      // Get street from first part
      if (addressParts.length > 0) {
        initialValues.street = addressParts[0].trim();
        
        // Get postal code and city from second part
        if (addressParts.length > 1) {
          const secondPart = addressParts[1].trim();
          
          // Try to find postal code (5 digits with optional space after 3 digits)
          const postalCodeMatch = secondPart.match(/\b(\d{3}\s?\d{2})\b/);
          
          if (postalCodeMatch) {
            initialValues.postalCode = postalCodeMatch[1];
            
            // City is the rest of the text after the postal code
            const cityText = secondPart.replace(postalCodeMatch[1], '').trim();
            initialValues.city = cityText;
          } else {
            // If no postal code is found, assume it's all city
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

  // Since error is already a string or null in useSalonsAdmin, we don't need to check instanceof
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
