import { supabase } from "@/integrations/supabase/client";

export async function getUserRole() {
  try {
    // First get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return null;
    }
    
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    // Then get their role using the user's ID
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (roleError) {
      console.error('Error fetching user role:', roleError);
      return null;
    }
    
    return roleData?.role || null;
  } catch (error) {
    console.error('Unexpected error in getUserRole:', error);
    return null;
  }
}