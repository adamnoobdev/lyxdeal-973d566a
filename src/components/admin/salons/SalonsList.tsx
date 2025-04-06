
import { useState, useEffect, useCallback, useRef } from "react";
import { Salon, SalonFormValues } from "../types";
import { useSalonsAdmin } from "@/hooks/useSalonsAdmin";
import { EditSalonDialog } from "./EditSalonDialog";
import { DeleteSalonDialog } from "./DeleteSalonDialog";
import { CreateSalonDialog } from "./CreateSalonDialog";
import { SalonsHeader } from "./SalonsHeader";
import { SalonsContent } from "./SalonsContent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SalonRatingDialog } from "./SalonRatingDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Komponent för att lista och hantera salonger i administratörsgränssnittet
 */
export const SalonsList = () => {
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [deletingSalon, setDeletingSalon] = useState<Salon | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [ratingSalon, setRatingSalon] = useState<Salon | null>(null);
  const [isRating, setIsRating] = useState(false);
  const isMountedRef = useRef(true);
  
  const { salons, isLoading, error, handleDelete, handleUpdate, handleCreate, fetchSalons } = useSalonsAdmin();

  // Ensure component is mounted
  useEffect(() => {
    isMountedRef.current = true;
    return () => { 
      isMountedRef.current = false; 
    };
  }, []);

  // Fetch salons when component mounts
  useEffect(() => {
    console.log("SalonsList mounting, fetching salons data...");
    fetchSalons();
  }, [fetchSalons]);

  // Safe state setter for component unmount protection
  const safeSetState = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  /**
   * Hantera borttagning av en salong
   */
  const onDelete = async () => {
    if (deletingSalon) {
      const success = await handleDelete(deletingSalon.id);
      if (success) {
        safeSetState(setDeletingSalon, null);
        if (selectedSalon?.id === deletingSalon.id) {
          safeSetState(setSelectedSalon, null);
        }
      }
    }
  };

  /**
   * Hantera uppdatering av en salong
   */
  const onUpdate = async (values: any) => {
    if (editingSalon) {
      console.log("Updating salon with values:", values);
      const success = await handleUpdate(values, editingSalon.id);
      if (success && isMountedRef.current) {
        safeSetState(setEditingSalon, null);
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
   * Hantera betygsättning av salong
   */
  const onRate = async (salonId: number, rating: number, comment: string) => {
    try {
      safeSetState(setIsRating, true);
      console.log("Betygsätter salong:", salonId, "betyg:", rating, "kommentar:", comment);
      
      // Uppdatera salongens rating i salons-tabellen
      const { error: updateError } = await supabase
        .from('salons')
        .update({ 
          rating: rating,
          rating_comment: comment
        })
        .eq('id', salonId);
      
      if (updateError) {
        console.error("Error updating salon rating:", updateError);
        toast.error("Kunde inte spara betyg");
        return false;
      }
      
      // Lägg till i betygshistorik
      try {
        const { error: ratingError } = await supabase
          .from('salon_ratings')
          .insert({
            salon_id: salonId,
            rating: rating,
            comment: comment,
            created_by: 'admin'
          });
          
        if (ratingError) {
          console.warn("Could not save rating history:", ratingError);
          // Continue anyway as the main rating update succeeded
        }
      } catch (historyError) {
        // Ignorera fel här eftersom detta är en sekundär lagring
        console.warn("Couldn't save rating history:", historyError);
      }
      
      // Uppdatera lokala salong-data genom att hämta alla salonger igen
      console.log("Rating saved, fetching updated salon data...");
      await fetchSalons();
      
      if (isMountedRef.current) {
        safeSetState(setRatingSalon, null); // Stäng dialogen
      }
      return true;
    } catch (error) {
      console.error("Error in rating salon:", error);
      toast.error("Ett fel uppstod när betyget skulle sparas");
      return false;
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsRating, false);
      }
    }
  };

  /**
   * Dela upp adressfält för redigering
   */
  const getInitialValuesForEdit = (salon: Salon): SalonFormValues => {
    // Skapa grundläggande initialvärden
    const initialValues: SalonFormValues = {
      name: salon.name,
      email: salon.email,
      phone: salon.phone || "",
      address: salon.address || "",
      termsAccepted: salon.terms_accepted !== false,
      privacyAccepted: salon.privacy_accepted !== false,
    };

    console.log("Preparing initial values for salon:", salon.name, "address:", salon.address);
    
    // För bakåtkompatibilitet försöker vi fortfarande tolka adressen
    // men använder det kompletta adressfältet som primär källa
    if (salon.address) {
      // Lägg till fullständig adress
      initialValues.address = salon.address;
      
      // Försök tolka delarna för historiska adresser i gammalt format
      try {
        const addressParts = salon.address.split(',');
        
        // Hämta gata från första delen
        if (addressParts.length > 0) {
          // Dessa värden används bara för visning i formuläret
          // och kommer att ersättas med faktiska värden från MapboxAddressInput
          // Vi behöver dem inte i initialValues eftersom de är dolda fält
          console.log("Extracted street:", addressParts[0].trim());
          
          // Hämta postnummer och stad från andra delen
          if (addressParts.length > 1) {
            const secondPart = addressParts[1].trim();
            
            // Försök hitta postnummer (5 siffror med valfritt mellanslag efter 3 siffror)
            const postalCodeMatch = secondPart.match(/\b(\d{3}\s?\d{2})\b/);
            
            if (postalCodeMatch) {
              console.log("Extracted postal code:", postalCodeMatch[1]);
              
              // Staden är resten av texten efter postnumret
              const cityText = secondPart.replace(postalCodeMatch[1], '').trim();
              console.log("Extracted city:", cityText);
            } else {
              // Om inget postnummer hittades, anta att det är hela staden
              console.log("No postal code found, using as city:", secondPart);
            }
          }
        }
      } catch (e) {
        console.warn("Could not parse address parts:", e);
        // Vid fel, använd bara det kompletta adressfältet
      }
    }
    
    console.log("Final initial values:", initialValues);
    return initialValues;
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 xs:px-4 sm:px-0">
      <SalonsHeader 
        onCreateClick={() => safeSetState(setIsCreating, true)} 
      />

      {error && (
        <Alert variant="destructive" className="mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs xs:text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <SalonsContent
        salons={salons}
        isLoading={isLoading}
        error={error}
        onCreateClick={() => safeSetState(setIsCreating, true)}
        onEditClick={(salon) => safeSetState(setEditingSalon, salon)}
        onDeleteClick={(salon) => safeSetState(setDeletingSalon, salon)}
        onSelect={(salon) => safeSetState(setSelectedSalon, salon)}
        selectedSalon={selectedSalon}
        onRate={(salon) => safeSetState(setRatingSalon, salon)}
      />

      <EditSalonDialog
        isOpen={!!editingSalon}
        onClose={() => safeSetState(setEditingSalon, null)}
        onSubmit={onUpdate}
        initialValues={editingSalon ? getInitialValuesForEdit(editingSalon) : undefined}
      />

      <DeleteSalonDialog
        isOpen={!!deletingSalon}
        onClose={() => safeSetState(setDeletingSalon, null)}
        onConfirm={onDelete}
        salonName={deletingSalon?.name}
        salonId={deletingSalon?.id}
        userId={deletingSalon?.user_id}
      />

      <CreateSalonDialog
        isOpen={isCreating}
        onClose={() => safeSetState(setIsCreating, false)}
        onSubmit={onCreate}
      />

      <SalonRatingDialog
        salon={ratingSalon}
        isOpen={!!ratingSalon}
        onClose={() => safeSetState(setRatingSalon, null)}
        onSave={onRate}
        isSubmitting={isRating}
      />
    </div>
  );
};
