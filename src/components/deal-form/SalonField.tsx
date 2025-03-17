
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";
import { useSession } from "@/hooks/useSession";

interface SalonFieldProps {
  form: UseFormReturn<FormValues>;
}

export const SalonField = ({ form }: SalonFieldProps) => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const [userSalonId, setUserSalonId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch salon info for logged in user (if any)
  useEffect(() => {
    if (user?.id) {
      const fetchUserSalon = async () => {
        const { data, error } = await supabase
          .from('salons')
          .select('id, role')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data) {
          setUserSalonId(data.id);
          setIsAdmin(data.role === 'admin');
          
          // If user is a salon owner, automatically set the salon_id field
          if (data.role === 'salon_owner') {
            form.setValue('salon_id', data.id);
          }
        }
      };
      
      fetchUserSalon();
    }
  }, [user?.id, form]);

  const { data: salons = [], isLoading: isSalonsLoading } = useQuery({
    queryKey: ["salons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salons")
        .select("id, name")
        .eq('role', 'salon_owner')
        .order("name");
      
      if (error) {
        console.error("Error fetching salons:", error);
        throw error;
      }
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'salons'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["salons"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <FormField
      control={form.control}
      name="salon_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Salong</FormLabel>
          <FormControl>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...field}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              value={field.value || ""}
              disabled={!isAdmin && userSalonId !== null}
            >
              <option value="">Välj salong...</option>
              {salons?.map((salon) => (
                <option 
                  key={salon.id} 
                  value={salon.id}
                  disabled={!isAdmin && userSalonId !== salon.id}
                >
                  {salon.name} {!isAdmin && userSalonId === salon.id ? '(Din salong)' : ''}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
