
import React from "react";
import { RelatedDeals } from "./RelatedDeals";

interface ProductRelatedDealsProps {
  currentDealId: number;
  category: string;
}

export const ProductRelatedDeals = ({ currentDealId, category }: ProductRelatedDealsProps) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Andra som såg på denna deal tittade även på</h2>
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <RelatedDeals
          currentDealId={currentDealId}
          category={category}
        />
      </div>
    </div>
  );
};
