
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

export const useFirstLogin = () => {
  const { session, user } = useSession();
  const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLogin = async () => {
      if (!user?.id) {
        setIsFirstLogin(false);
        setIsLoading(false);
        return;
      }

      // Check if we've already determined this in the current session
      const localStatusKey = `salon_first_login_${user.id}`;
      const localStatus = localStorage.getItem(localStatusKey);
      
      if (localStatus === 'false') {
        setIsFirstLogin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("salon_user_status")
          .select("first_login")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        
        // Om vi inte hittar någon rad eller first_login är true, anta att det är första inloggningen
        const isFirst = !data || data.first_login === true;
        setIsFirstLogin(isFirst);
        
        // Store the result in localStorage to avoid checking again in this session
        if (!isFirst) {
          localStorage.setItem(localStatusKey, 'false');
        }
      } catch (error) {
        console.error("Fel vid kontroll av första inloggning:", error);
        // Om något går fel, anta att det inte är första inloggningen
        setIsFirstLogin(false);
        localStorage.setItem(localStatusKey, 'false');
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLogin();
  }, [user]);

  return {
    isFirstLogin,
    isLoading
  };
};
