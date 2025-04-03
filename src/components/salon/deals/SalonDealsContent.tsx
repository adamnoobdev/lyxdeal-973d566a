
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SalonDealsError } from '@/components/admin/salons/SalonDealsError';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealsTable } from '@/components/admin/deals/DealsTable';
import { Deal } from '@/components/admin/types';

interface SalonDealsContentProps {
  deals: Deal[];
  isLoading: boolean;
  error: string | null;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onViewDiscountCodes: (deal: Deal) => void;
  onGenerateDiscountCodes: (deal: Deal, quantity: number) => Promise<void>;
  isGeneratingCodes: boolean;
}

export const SalonDealsContent: React.FC<SalonDealsContentProps> = ({
  deals,
  isLoading,
  error,
  onEdit,
  onDelete,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <Skeleton className="h-24 sm:h-32 w-full" />
        <Skeleton className="h-24 sm:h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return <SalonDealsError message={error} />;
  }

  return (
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm p-1 xs:p-2 sm:p-4 mb-3 sm:mb-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-sm xs:text-base sm:text-lg">Dina erbjudanden</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DealsTable
          deals={deals}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDiscountCodes={onViewDiscountCodes}
          onGenerateDiscountCodes={onGenerateDiscountCodes}
          isGeneratingCodes={isGeneratingCodes}
          isSalonView={true}
        />
      </CardContent>
    </Card>
  );
};
