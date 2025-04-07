
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Deal } from "@/types/deal";
import { DiscountCodesList } from "./discount-codes/DiscountCodesList";
import { useState, useEffect, useRef } from "react";
import { DiscountCodesEmptyState } from "./discount-codes/DiscountCodesEmptyState";
import { DiscountCodesGenerator } from "./discount-codes/DiscountCodesGenerator";
import { DiscountCodesDirectBooking } from "./discount-codes/DiscountCodesDirectBooking";
import { supabase } from "@/integrations/supabase/client";

interface DiscountCodesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
  isGeneratingCodes?: boolean;
}

export const DiscountCodesDialog = ({
  isOpen,
  onClose,
  deal,
  onGenerateDiscountCodes,
  isGeneratingCodes
}: DiscountCodesDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [codes, setCodes] = useState<any[]>([]);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const safeToUpdateRef = useRef(true);
  
  // If the deal doesn't require discount codes, we don't need to load them
  const requiresDiscountCode = deal?.requires_discount_code !== false;

  // Synkronisera den interna open-staten med props
  useEffect(() => {
    if (isOpen) {
      setInternalIsOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset state when dialog opens
    if (isOpen && deal) {
      console.log("[DiscountCodesDialog] Dialog opened, resetting states and loading data");
      setIsLoading(true);
      safeToUpdateRef.current = true;
      
      // Only fetch discount codes if the deal requires them
      if (requiresDiscountCode) {
        fetchCodes();
      } else {
        setIsLoading(false);
        setCodes([]);
      }
    }
    
    return () => {
      console.log("[DiscountCodesDialog] Dialog component unmounting or dependencies changing");
    };
  }, [isOpen, deal?.id, requiresDiscountCode]);

  const fetchCodes = async () => {
    if (!deal) return;
    
    try {
      console.log(`[DiscountCodesDialog] Fetching codes for deal ID: ${deal.id}`);
      // Use the Deal ID to fetch all discount codes for this deal
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('deal_id', deal.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (safeToUpdateRef.current) {
        console.log(`[DiscountCodesDialog] Setting ${data?.length || 0} codes for deal ID: ${deal.id}`);
        setCodes(data || []);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[DiscountCodesDialog] Error fetching discount codes:', error);
      if (safeToUpdateRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Förbättrad stängningshantering med en säker uppdateringsmetod
  const handleClose = () => {
    console.log("[DiscountCodesDialog] handleClose called, starting safe closing sequence");
    
    // Markera först att det inte är säkert att uppdatera tillståndet
    safeToUpdateRef.current = false;
    
    // Stäng den interna dialogen
    setInternalIsOpen(false);
    
    // Notifiera föräldern om stängning
    setTimeout(() => {
      console.log("[DiscountCodesDialog] Delayed onClose callback execution");
      onClose();
    }, 100);
  };

  return (
    <Dialog open={internalIsOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {requiresDiscountCode ? "Rabattkoder" : "Direkt bokning"}
          </DialogTitle>
          <DialogDescription>
            {requiresDiscountCode 
              ? `Visa alla rabattkoder för erbjudandet "${deal?.title}"`
              : `Detta erbjudande använder direkt bokning utan rabattkoder`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 flex-1 overflow-y-auto">
          {!requiresDiscountCode ? (
            <DiscountCodesDirectBooking deal={deal} />
          ) : isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          ) : codes.length === 0 ? (
            <DiscountCodesEmptyState 
              deal={deal} 
              onGenerateDiscountCodes={onGenerateDiscountCodes} 
            />
          ) : (
            <>
              <DiscountCodesList codes={codes} />
              
              {onGenerateDiscountCodes && (
                <div className="mt-6 pt-6 border-t">
                  <DiscountCodesGenerator 
                    deal={deal} 
                    onGenerateDiscountCodes={onGenerateDiscountCodes} 
                    isGeneratingCodes={isGeneratingCodes}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
