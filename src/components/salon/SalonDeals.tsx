
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSalonDealsManagement } from '@/hooks/useSalonDealsManagement';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const SalonDeals: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useSalonDealsManagement(id ? parseInt(id) : undefined);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Ett fel uppstod: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Hantera Erbjudande</h1>
      
      {data && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-2">{data.title}</h2>
          <p className="text-gray-600 mb-4">{data.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button variant="outline">Redigera erbjudande</Button>
            <Button variant="destructive">Ta bort erbjudande</Button>
          </div>
        </div>
      )}
    </div>
  );
};
