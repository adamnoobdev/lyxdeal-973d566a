
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PartnerForm, type PartnerFormValues } from "@/components/partner/PartnerForm";

interface SignupFormContainerProps {
  selectedPlan: {
    title: string;
    paymentType: 'monthly' | 'yearly';
    price: number;
    dealCount: number;
  } | null;
}

const SignupFormContainer: React.FC<SignupFormContainerProps> = ({ selectedPlan }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Fyll i dina uppgifter</CardTitle>
      </CardHeader>
      <CardContent>
        <PartnerForm selectedPlan={selectedPlan} />
      </CardContent>
    </Card>
  );
};

export default SignupFormContainer;
