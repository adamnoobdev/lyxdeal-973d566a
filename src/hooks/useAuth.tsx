
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type Profile = {
  id?: string;
  role?: 'user' | 'creator' | 'admin' | 'salon_owner';
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
      // For now we're just simulating a profile
      // In production, you would fetch the profile from a 'profiles' table
      setProfile({
        id: userId,
        role: 'creator', // Default to creator for testing
        instagram_handle: 'creator_handle'
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
