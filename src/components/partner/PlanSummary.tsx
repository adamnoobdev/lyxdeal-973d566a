
import React from "react";
import { cn } from "@/lib/utils";

interface SelectedPlan {
  title: string;
  paymentType: 'monthly' | 'yearly';
  price: number;
  dealCount: number;
}

interface PlanSummaryProps {
  plan: SelectedPlan | null;
  className?: string;
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({ plan, className }) => {
  if (!plan) return null;

  return (
    <div className={cn(
      "mt-4 p-4 bg-primary-50 border border-primary/20 rounded-md inline-block shadow-sm transition-all hover:shadow-md",
      className
    )}>
      <h2 className="font-semibold text-xl text-primary-700">
        {plan.title}
      </h2>
      <p className="text-gray-700">
        {plan.paymentType === 'monthly' ? 'Månadsbetalning' : 'Årsbetalning'}: 
        {' '}<span className="font-semibold">{plan.price} SEK</span>
      </p>
      <p className="text-sm mt-1">
        {plan.dealCount} erbjudande{plan.dealCount > 1 ? 'n' : ''}
      </p>
    </div>
  );
};
