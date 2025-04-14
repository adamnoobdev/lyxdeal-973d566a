
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export const useFirstLogin = () => {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session, user } = useSession();

  useEffect(() => {
    const checkFirstLoginStatus = async () => {
      if (!session || !user) {
        setIsFirstLogin(null);
        setIsLoading(false);
        return;
      }

      try {
        const userId = user.id;
        
        // Kontrollera om vi redan har en cachad status i localStorage
        const cachedStatus = localStorage.getItem(`salon_first_login_${userId}`);
        
        if (cachedStatus === 'false') {
          console.log('Using cached first login status: false');
          setIsFirstLogin(false);
          setIsLoading(false);
          return;
        }
        
        console.log('Checking first login status from database for user:', userId);
        
        // Om ingen cachad status finns eller den inte är 'false', kontrollera databasen
        const { data, error } = await supabase
          .from('salon_user_status')
          .select('first_login')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching first login status:', error);
          // Standardvärde är false om det uppstår ett fel
          setIsFirstLogin(false);
        } else if (data) {
          console.log('First login status from database:', data.first_login);
          setIsFirstLogin(data.first_login);
          
          // Uppdatera cache om det inte är första inloggningen
          if (data.first_login === false) {
            localStorage.setItem(`salon_first_login_${userId}`, 'false');
          }
        } else {
          // Om ingen data hittades, anta att det är första inloggningen
          console.log('No first login status found, assuming first login');
          setIsFirstLogin(true);
        }
      } catch (err) {
        console.error('Unexpected error checking first login status:', err);
        // Standardvärde är false om det uppstår ett fel
        setIsFirstLogin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLoginStatus();
  }, [session, user]);

  return { isFirstLogin, isLoading };
};
