
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Deal } from "@/types/deal";
import { Tag, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SecureDealButtonProps {
  deal: Deal;
  isExpired: boolean;
  isSoldOut: boolean;
}

export const SecureDealButton = ({ deal, isExpired, isSoldOut }: SecureDealButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  
  // Check if the deal uses direct booking
  const isDirectBooking = deal.requires_discount_code === false;
  
  // Determine the button text and icon
  const getButtonContent = () => {
    if (isExpired) {
      return { text: "Erbjudandet har löpt ut", icon: null };
    }
    
    if (isSoldOut) {
      return { text: "Slutsålt", icon: null };
    }
    
    if (isDirectBooking) {
      return { text: "Gå till bokning", icon: <ExternalLink className="h-4 w-4 mr-2" /> };
    }
    
    return { text: "Säkra rabattkod", icon: <Tag className="h-4 w-4 mr-2" /> };
  };
  
  const { text, icon } = getButtonContent();
  
  // Determine the click handler
  const handleClick = () => {
    if (isExpired || isSoldOut) {
      return;
    }
    
    if (isDirectBooking && deal.booking_url) {
      window.open(deal.booking_url, '_blank');
      return;
    }
    
    // Navigate to the secure deal page
    navigate(`/secure-deal/${deal.id}`);
  };
  
  return (
    <Button
      className="w-full mt-4 py-6 text-base font-semibold"
      disabled={isExpired || isSoldOut}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      variant={isExpired || isSoldOut ? "outline" : "default"}
    >
      {icon}
      {text}
    </Button>
  );
};
