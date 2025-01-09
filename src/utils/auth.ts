import { supabase } from "@/integrations/supabase/client";

export async function getUserRole() {
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .single();
  
  if (roleError) {
    console.error('Error fetching user role:', roleError);
    return null;
  }
  
  return roleData?.role;
}