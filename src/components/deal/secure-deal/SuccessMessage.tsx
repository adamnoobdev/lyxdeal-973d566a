
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onReset: () => void;
}

export const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">Tack!</h2>
      <p className="text-gray-600">
        Din rabattkod har skickats till din e-post. 
        Koden är giltig i 72 timmar från nu.
      </p>
      <Button 
        className="mt-4" 
        onClick={onReset}
      >
        Säkra en annan rabattkod
      </Button>
    </div>
  );
};
