
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SalonDealsError } from '@/components/admin/salons/SalonDealsError';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealsTable } from '@/components/admin/deals/DealsTable';
import { Deal } from '@/types/deal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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
        <Skeleton className="h-24 sm:h-28 w-full" />
        <Skeleton className="h-24 sm:h-28 w-full" />
      </div>
    );
  }

  if (error) {
    return <SalonDealsError message={error} />;
  }

  // Gruppera erbjudanden efter status
  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const approvedDeals = deals.filter(deal => deal.status === 'approved');
  const rejectedDeals = deals.filter(deal => deal.status === 'rejected');

  return (
    <div className="space-y-6">
      {rejectedDeals.length > 0 && (
        <Card className="border border-destructive/30 bg-destructive/5 rounded-lg overflow-hidden shadow-sm mb-4 sm:mb-5">
          <CardHeader className="px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-2 border-b border-destructive/20">
            <CardTitle className="text-base md:text-lg font-semibold text-destructive">Avslagna erbjudanden</CardTitle>
          </CardHeader>
          <CardContent className="px-2 xs:px-3 sm:px-4 py-2 sm:py-3">
            {rejectedDeals.map(deal => (
              <div key={deal.id} className="mb-4 last:mb-0">
                <Alert variant="destructive" className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs xs:text-sm">
                    <span className="font-semibold">{deal.title}</span>: {deal.rejection_message || "Ditt erbjudande har avslagits. Vänligen redigera och skicka in igen."}
                  </AlertDescription>
                </Alert>
                <DealsTable
                  deals={[deal]}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isSalonView={true}
                  actionButtonsConfig={{
                    edit: true,
                    delete: true,
                    preview: false,
                    viewCodes: false
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {pendingDeals.length > 0 && (
        <Card className="border border-orange-300/30 bg-orange-50/50 rounded-lg overflow-hidden shadow-sm mb-4 sm:mb-5">
          <CardHeader className="px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-2 border-b border-orange-200/30">
            <CardTitle className="text-base md:text-lg font-semibold text-orange-600">Väntande på godkännande</CardTitle>
          </CardHeader>
          <CardContent className="px-2 xs:px-3 sm:px-4 py-2 sm:py-3">
            <DealsTable
              deals={pendingDeals}
              onEdit={onEdit}
              onDelete={onDelete}
              isSalonView={true}
              actionButtonsConfig={{
                edit: true,
                delete: true,
                preview: false,
                viewCodes: false
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm mb-4 sm:mb-5">
        <CardHeader className="px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-2">
          <CardTitle className="text-base md:text-lg font-semibold">Godkända erbjudanden</CardTitle>
        </CardHeader>
        <CardContent className="px-2 xs:px-3 sm:px-4 py-2 sm:py-3">
          {approvedDeals.length > 0 ? (
            <DealsTable
              deals={approvedDeals}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDiscountCodes={onViewDiscountCodes}
              onGenerateDiscountCodes={onGenerateDiscountCodes}
              isGeneratingCodes={isGeneratingCodes}
              isSalonView={true}
              actionButtonsConfig={{
                edit: true,
                delete: true,
                preview: false,
                viewCodes: true
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground py-3">Du har inga godkända erbjudanden ännu.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
