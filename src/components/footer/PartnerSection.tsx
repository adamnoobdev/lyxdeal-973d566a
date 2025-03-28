
import { useNavigate } from "react-router-dom";

interface PartnerSectionProps {
  onNavigate: (path: string) => void;
}

export const PartnerSection = ({ onNavigate }: PartnerSectionProps) => {
  const navigate = useNavigate();
  
  const handlePartnerClick = () => {
    navigate("/partner");
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="text-center sm:text-left space-y-4">
      <h3 className="font-semibold text-lg">För företag</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={handlePartnerClick}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Bli salongspartner
          </button>
        </li>
      </ul>
    </div>
  );
};
