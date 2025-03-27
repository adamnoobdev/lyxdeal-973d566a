
import { CheckCircle } from "lucide-react";

export const SuccessHeader = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-20 w-20 text-green-500" />
      </div>
      
      <h2 className="text-2xl lg:text-3xl font-bold text-center text-purple-900">
        Prenumeration genomförd!
      </h2>
      
      <p className="text-center text-gray-700">
        Din betalning har genomförts och ditt konto håller på att skapas. Du kommer att få ett e-postmeddelande 
        med inloggningsuppgifter till den e-postadress du angav under registreringen.
      </p>
    </>
  );
};
