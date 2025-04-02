
import React from "react";
import { PlanSummary } from "@/components/partner/PlanSummary";

interface PlanSummarySectionProps {
  plan: {
    title: string;
    paymentType: 'monthly' | 'yearly';
    price: number;
    dealCount: number;
  } | null;
}

const PlanSummarySection: React.FC<PlanSummarySectionProps> = ({ plan }) => {
  if (!plan) return null;
  
  return (
    <div className="text-center mb-8">
      <PlanSummary 
        plan={plan} 
        className="mx-auto" 
      />
    </div>
  );
};

export default PlanSummarySection;
