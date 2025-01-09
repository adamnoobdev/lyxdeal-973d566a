import { supabase } from "@/integrations/supabase/client";

export async function getUserRole() {
  try {
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
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