import { supabase } from "@/integrations/supabase/client";
import { Role } from "@/types/auth";

export async function getUserRole(): Promise<Role | null> {
  try {
    // First check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
    }

    if (!session) {
      console.log('No active session found');
      return null;
    }

    // Get the role for the authenticated user
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (roleError) {
      console.error('Error fetching user role:', roleError);
      return null;
    }

    if (!roleData) {
      console.log('No role found for user');
      return null;
    }

    return roleData.role as Role;
  } catch (error) {
    console.error('Unexpected error in getUserRole:', error);
    return null;
  }
}