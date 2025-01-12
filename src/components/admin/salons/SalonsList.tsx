import { useState, useEffect } from "react";
import { Salon } from "../types";
import { useSalonsAdmin } from "@/hooks/useSalonsAdmin";
import { EditSalonDialog } from "./EditSalonDialog";
import { DeleteSalonDialog } from "./DeleteSalonDialog";
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
    console.log("Initiating salon fetch");
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
    const success = await handleCreate(values);
    if (success) {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <SalonsLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <SalonsHeader 
        error={error} 
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
        isOpen={!!editingSalon || isCreating}
        onClose={() => {
          setEditingSalon(null);
          setIsCreating(false);
        }}
        onSubmit={editingSalon ? onUpdate : onCreate}
        initialValues={
          editingSalon
            ? {
                name: editingSalon.name,
                email: editingSalon.email,
                phone: editingSalon.phone || "",
                address: editingSalon.address || "",
              }
            : undefined
        }
      />

      <DeleteSalonDialog
        isOpen={!!deletingSalon}
        onClose={() => setDeletingSalon(null)}
        onConfirm={onDelete}
        salonName={deletingSalon?.name}
      />
    </div>
  );
};