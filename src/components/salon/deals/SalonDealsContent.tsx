
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
      <div className="space-y-4 sm:space-y-5">
        <Skeleton className="h-28 sm:h-36 w-full" />
        <Skeleton className="h-28 sm:h-36 w-full" />
      </div>
    );
  }

  if (error) {
    return <SalonDealsError message={error} />;
  }

  return (
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm mb-6">
      <CardHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3">
        <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">Dina erbjudanden</CardTitle>
      </CardHeader>
      <CardContent className="px-2 xs:px-4 sm:px-6 py-3 sm:py-4">
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
