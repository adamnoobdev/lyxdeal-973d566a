import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Salon } from "../types";
import { SalonsTable } from "./SalonsTable";
import { EditSalonDialog } from "./EditSalonDialog";
import { DeleteSalonDialog } from "./DeleteSalonDialog";
import { CreateSalonDialog } from "./CreateSalonDialog";
import { SalonsLoadingSkeleton } from "./SalonsLoadingSkeleton";
import { useSalonsAdmin } from "@/hooks/useSalonsAdmin";

export const SalonsList = () => {
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [deletingSalon, setDeletingSalon] = useState<Salon | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { salons, isLoading, error, fetchSalons, handleDelete, handleUpdate, handleCreate } = useSalonsAdmin();

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

  const onCreate = async (values: { name: string; email: string; phone?: string; address?: string }) => {
    const success = await handleCreate(values);
    if (success) {
      setIsCreateDialogOpen(false);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Salonger</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Skapa ny salong
        </Button>
      </div>

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

      <CreateSalonDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={onCreate}
      />
    </div>
  );
};