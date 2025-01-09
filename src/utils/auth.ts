import { supabase } from "@/integrations/supabase/client";

export async function getUserRole() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (roleError) {
      console.error('Fel vid hämtning av användarroll:', roleError);
      return null;
    }
    
    return roleData?.role;
  } catch (error) {
    console.error('Oväntat fel vid hämtning av användarroll:', error);
    return null;
  }
}