import { useState, useEffect } from "react";
import { Salon } from "../types";
import { SalonsTable } from "./SalonsTable";
import { EditSalonDialog } from "./EditSalonDialog";
import { DeleteSalonDialog } from "./DeleteSalonDialog";
import { SalonsLoadingSkeleton } from "./SalonsLoadingSkeleton";
import { useSalonsAdmin } from "@/hooks/useSalonsAdmin";

export const SalonsList = () => {
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [deletingSalon, setDeletingSalon] = useState<Salon | null>(null);
  const { salons, isLoading, error, fetchSalons, handleDelete, handleUpdate } = useSalonsAdmin();

  useEffect(() => {
    fetchSalons();
  }, []);

  const onDelete = async () => {
    if (deletingSalon) {
      const success = await handleDelete(deletingSalon.id);
      if (success) {
        setDeletingSalon(null);
      }
    }
  };

  const onUpdate = async (values: { name: string; email: string; phone?: string; address?: string }) => {
    if (editingSalon) {
      const success = await handleUpdate(values, editingSalon.id);
      if (success) {
        setEditingSalon(null);
      }
    }
  };

  if (isLoading) {
    return <SalonsLoadingSkeleton />;
  }

  if (error) return (
    <div className="text-center py-8 text-red-500">
      Ett fel uppstod när salonger skulle hämtas
    </div>
  );

  return (
    <>
      <SalonsTable
        salons={salons || []}
        onEdit={setEditingSalon}
        onDelete={setDeletingSalon}
      />

      <EditSalonDialog
        isOpen={!!editingSalon}
        onClose={() => setEditingSalon(null)}
        onSubmit={onUpdate}
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
    </>
  );
};