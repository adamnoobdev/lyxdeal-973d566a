
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'user' | 'creator' | 'admin' | 'salon_owner';

export type Profile = {
  id?: string;
  role?: UserRole;
  instagram_handle?: string;
  display_name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Fetch profile if we have a user
        if (newSession?.user) {
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchProfile = async (userId: string) => {
    try {
      // Försök hämta användarens roll från salons-tabellen först
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (salonData && !salonError) {
        setProfile({
          id: userId,
          role: salonData.role as UserRole,
        });
        setLoading(false);
        return;
      }

      // Om användaren inte hittades i salons-tabellen, 
      // kan vi kontrollera andra källor eller använda default-värden
      // För nu, sätt en default-roll
      setProfile({
        id: userId,
        role: 'user', // Default-roll om inget annat hittas
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    profile
  };
};
