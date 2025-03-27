
import { PurchaseDetails, SalonAccount } from "@/hooks/subscription/types";
import { SuccessHeader } from "./SuccessHeader";
import { ImportantNotice } from "./ImportantNotice";
import { OrderInformation } from "./OrderInformation";
import { AccountCreationStatus } from "./AccountCreationStatus";
import { NavigationButtons } from "./NavigationButtons";

interface PurchaseDetailsComponentProps {
  purchaseDetails: PurchaseDetails | null;
  salonAccount: SalonAccount | null;
  isRetrying: boolean;
  timeElapsed: number;
  onRetry: () => void;
}

export const PurchaseDetailsComponent = ({
  purchaseDetails,
  salonAccount,
  isRetrying,
  timeElapsed,
  onRetry
}: PurchaseDetailsComponentProps) => {
  if (!purchaseDetails) {
    return (
      <div className="space-y-6">
        <SuccessHeader />
        <ImportantNotice />
        <NavigationButtons />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <SuccessHeader />
      <ImportantNotice />

      <OrderInformation purchaseDetails={purchaseDetails} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Salongskonto</h3>
        <AccountCreationStatus 
          salonAccount={salonAccount} 
          isRetrying={isRetrying} 
          timeElapsed={timeElapsed} 
          onRetry={onRetry} 
        />
      </div>

      <NavigationButtons />
    </div>
  );
};
