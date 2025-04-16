
import { useNavigate } from "react-router-dom";

interface PartnerSectionProps {
  onNavigate: (path: string) => void;
}

export const PartnerSection = ({ onNavigate }: PartnerSectionProps) => {
  const navigate = useNavigate();
  
  const handlePartnerClick = () => {
    navigate("/partner");
  };
  
  const handleCreatorClick = () => {
    navigate("/creator");
  };
  
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold text-lg mb-4">För företag</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={handlePartnerClick}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Bli salongspartner
          </button>
        </li>
        <li>
          <button
            onClick={handleCreatorClick}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Bli kreatör
          </button>
        </li>
      </ul>
    </div>
  );
};
