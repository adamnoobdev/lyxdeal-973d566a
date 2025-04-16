
import { Helmet } from "react-helmet";
import { SignupHeader } from "@/components/creator/signup/SignupHeader";
import { SignupFormContainer } from "@/components/creator/signup/SignupFormContainer";

const CreatorSignup = () => {
  return (
    <>
      <Helmet>
        <title>Bli kreatör | Lyxdeal</title>
        <meta name="description" content="Registrera dig som kreatör på Lyxdeal" />
      </Helmet>
      
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <SignupHeader />
            <SignupFormContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorSignup;
