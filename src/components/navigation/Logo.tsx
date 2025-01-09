import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Logo = () => {
  const { data: { publicUrl } } = supabase
    .storage
    .from('assets')
    .getPublicUrl('Lyxdeal-logo.svg');

  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
      aria-label="Gå till startsidan"
    >
      <img 
        src={publicUrl} 
        alt="Lyxdeal Logo" 
        className="h-8 w-auto"
      />
    </Link>
  );
};