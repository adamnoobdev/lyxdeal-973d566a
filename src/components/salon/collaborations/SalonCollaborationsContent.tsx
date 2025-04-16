
import { useState, useEffect } from "react";
import { useSalonCollaborations } from "@/hooks/useSalonCollaborations";
import { SalonCollaborationsList } from "./SalonCollaborationsList";
import { SalonCollaborationStatistics } from "./SalonCollaborationStatistics";
import { SalonCollaborationEmptyState } from "./SalonCollaborationEmptyState";
import { SalonCollaborationsLoadingSkeleton } from "./SalonCollaborationsLoadingSkeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateCollaborationDialog } from "./CreateCollaborationDialog";
import { useAuth } from "@/hooks/useAuth";

interface SalonCollaborationsContentProps {
  salonId: number | undefined;
}

export function SalonCollaborationsContent({ salonId }: SalonCollaborationsContentProps) {
  const { profile } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { 
    collaborations, 
    isLoading, 
    error, 
    activeCollaborations,
    refetch
  } = useSalonCollaborations(salonId);

  if (isLoading) {
    return <SalonCollaborationsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Fel vid hämtning av samarbeten</AlertTitle>
        <AlertDescription>
          Det uppstod ett fel när dina samarbeten skulle hämtas. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Samarbeten med kreatörer</h2>
          <p className="text-muted-foreground mt-1">
            Hantera dina samarbeten med sociala medie-kreatörer
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Skapa samarbete
        </Button>
      </div>
      
      {/* Statistik för samarbeten */}
      <SalonCollaborationStatistics 
        salonId={salonId} 
        collaborations={activeCollaborations} 
      />
      
      {/* Lista av aktiva samarbeten */}
      {collaborations.length > 0 ? (
        <SalonCollaborationsList 
          collaborations={collaborations}
          salonId={salonId}
        />
      ) : (
        <SalonCollaborationEmptyState 
          onCreateClick={() => setShowCreateDialog(true)} 
        />
      )}

      {/* Dialog för att skapa nytt samarbete */}
      <CreateCollaborationDialog
        salonId={salonId}
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          setShowCreateDialog(false);
          refetch();
        }}
      />
    </div>
  );
}
