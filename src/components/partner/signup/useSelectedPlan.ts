
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface SelectedPlan {
  title: string;
  paymentType: 'monthly' | 'yearly';
  price: number;
  dealCount: number;
}

export const useSelectedPlan = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  
  useEffect(() => {
    const title = searchParams.get('plan');
    const paymentType = searchParams.get('type') as 'monthly' | 'yearly';
    const price = Number(searchParams.get('price'));
    const dealCount = Number(searchParams.get('deals'));
    
    if (title && paymentType && price && dealCount) {
      setSelectedPlan({
        title,
        paymentType,
        price,
        dealCount
      });
    } else {
      // If no valid plan info, redirect back to partner page
      toast.error("Inget paket valdes. Vänligen försök igen.");
      navigate('/partner');
    }
  }, [searchParams, navigate]);

  return { selectedPlan };
};
