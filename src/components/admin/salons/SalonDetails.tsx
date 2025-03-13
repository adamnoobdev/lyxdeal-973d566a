
import { Salon } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { DealsTable } from "../deals/DealsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SalonDetailsProps {
  salon: Salon;
}

export const SalonDetails = ({ salon }: SalonDetailsProps) => {
  const { data: deals, isLoading } = useQuery({
    queryKey: ['salon-deals', salon.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('salon_id', salon.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deal[];
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{salon.name}</CardTitle>
          <CardDescription>Salongsinformation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>ID: {salon.id}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="break-all">{salon.email}</span>
          </div>
          {salon.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{salon.phone}</span>
            </div>
          )}
          {salon.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{salon.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>
              Skapad {format(new Date(salon.created_at), "d MMMM yyyy", { locale: sv })}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Erbjudanden</CardTitle>
          <CardDescription>Aktiva erbjudanden från denna salong</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : deals?.length ? (
            <ScrollArea className="max-h-[300px]">
              <div className="overflow-x-auto">
                <DealsTable 
                  deals={deals} 
                  onEdit={() => {}} 
                  onDelete={() => {}} 
                />
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Denna salong har inga aktiva erbjudanden
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
