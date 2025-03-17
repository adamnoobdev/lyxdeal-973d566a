
import { PurchasesTableContent } from './purchases/PurchasesTableContent';
import { PurchasesTableSkeleton } from './purchases/PurchasesTableSkeleton';
import { EmptyPurchasesList } from './purchases/EmptyPurchasesList';

interface Purchase {
  id: number;
  customer_email: string;
  discount_code: string;
  created_at: string;
  deals?: {
    title: string;
  };
}

interface PurchasesTableProps {
  purchases: Purchase[];
  isLoading?: boolean;
}

export const PurchasesTable = ({ purchases, isLoading }: PurchasesTableProps) => {
  if (isLoading) {
    return <PurchasesTableSkeleton />;
  }

  if (!purchases?.length) {
    return <EmptyPurchasesList />;
  }

  return <PurchasesTableContent purchases={purchases} />;
};
