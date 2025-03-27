
import { PurchaseDetails } from "@/hooks/subscription/types";
import { formatDate } from "@/hooks/subscription/formatUtils";

interface OrderInformationProps {
  purchaseDetails: PurchaseDetails;
}

export const OrderInformation = ({ purchaseDetails }: OrderInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Beställningsinformation</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Salong</p>
          <p className="font-medium">{purchaseDetails.business_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">E-post</p>
          <p className="font-medium">{purchaseDetails.email}</p>
        </div>
        {purchaseDetails.plan_title && (
          <div>
            <p className="text-sm text-gray-500">Paket</p>
            <p className="font-medium">{purchaseDetails.plan_title}</p>
          </div>
        )}
        {purchaseDetails.plan_payment_type && (
          <div>
            <p className="text-sm text-gray-500">Betalningsplan</p>
            <p className="font-medium">
              {purchaseDetails.plan_payment_type === 'monthly' ? 'Månadsvis' : 'Årsvis'}
            </p>
          </div>
        )}
        {purchaseDetails.created_at && (
          <div>
            <p className="text-sm text-gray-500">Beställningsdatum</p>
            <p className="font-medium">{formatDate(purchaseDetails.created_at)}</p>
          </div>
        )}
        {purchaseDetails.status && (
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium capitalize">{purchaseDetails.status}</p>
          </div>
        )}
      </div>
    </div>
  );
};
