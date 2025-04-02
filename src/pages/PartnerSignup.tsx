
import { Helmet } from "react-helmet";
import SignupHeader from "@/components/partner/signup/SignupHeader";
import PlanSummarySection from "@/components/partner/signup/PlanSummarySection";
import SignupFormContainer from "@/components/partner/signup/SignupFormContainer";
import { useSelectedPlan } from "@/components/partner/signup/useSelectedPlan";

const PartnerSignup = () => {
  const { selectedPlan } = useSelectedPlan();

  return (
    <>
      <Helmet>
        <title>Bli salongspartner | Lyxdeal</title>
        <meta name="description" content="Registrera dig som salongspartner på Lyxdeal" />
      </Helmet>
      
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <SignupHeader />
            <PlanSummarySection plan={selectedPlan} />
            <SignupFormContainer selectedPlan={selectedPlan} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerSignup;
