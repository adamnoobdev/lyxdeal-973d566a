
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Deal } from "@/types/deal";
import { DiscountCodesList } from "./discount-codes/DiscountCodesList";
import { useState, useEffect } from "react";
import { DiscountCodesEmptyState } from "./discount-codes/DiscountCodesEmptyState";
import { DiscountCodesGenerator } from "./discount-codes/DiscountCodesGenerator";
import { DiscountCodesDirectBooking } from "./discount-codes/DiscountCodesDirectBooking";
import { supabase } from "@/integrations/supabase/client";

interface DiscountCodesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
}

export const DiscountCodesDialog = ({
  isOpen,
  onClose,
  deal,
  onGenerateDiscountCodes
}: DiscountCodesDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [codes, setCodes] = useState<any[]>([]);
  
  // If the deal doesn't require discount codes, we don't need to load them
  const requiresDiscountCode = deal?.requires_discount_code !== false;

  useEffect(() => {
    // Reset state when dialog opens
    if (isOpen && deal) {
      setIsLoading(true);
      
      // Only fetch discount codes if the deal requires them
      if (requiresDiscountCode) {
        fetchCodes();
      } else {
        setIsLoading(false);
        setCodes([]);
      }
    }
  }, [isOpen, deal?.id]);

  const fetchCodes = async () => {
    if (!deal) return;
    
    try {
      // Use the Deal ID to fetch all discount codes for this deal
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('deal_id', deal.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCodes(data || []);
    } catch (error) {
      console.error('Error fetching discount codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
