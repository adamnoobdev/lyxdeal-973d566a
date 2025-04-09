
import React from "react";
import { Deal } from "@/types/deal";
import { Ticket, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BookingTypeIndicatorProps {
  deal: Deal;
}

export const BookingTypeIndicator: React.FC<BookingTypeIndicatorProps> = ({ deal }) => {
  const usesDiscountCodes = deal.requires_discount_code === true;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center justify-center">
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
              usesDiscountCodes 
                ? "bg-primary/20 text-primary border border-primary/30" 
                : "bg-blue-100 text-blue-700 border border-blue-200"
            )}>
              {usesDiscountCodes ? (
                <>
                  <Ticket className="h-3 w-3" />
                  <span>Rabattkod</span>
                </>
              ) : (
                <>
                  <ExternalLink className="h-3 w-3" />
                  <span>Direktbokning</span>
                </>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {usesDiscountCodes 
            ? "Detta erbjudande använder rabattkoder" 
            : "Detta erbjudande länkar kunder direkt till bokningssystem"
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
