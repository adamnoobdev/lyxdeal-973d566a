
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to salon login page
    navigate('/salon/login', { replace: true });
  }, [navigate]);

  return null; // This component won't render anything since it redirects immediately
}
