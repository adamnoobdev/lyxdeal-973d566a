import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface CreateCollaborationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (values: any) => Promise<void>;
}

export const CreateCollaborationDialog = ({ isOpen, onClose, onCreate }: CreateCollaborationDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    compensation: "",
    salon_id: "",
    deal_id: "",
    max_creators: 5,
    expires_at: null as Date | null,
  });
  
  const [salons, setSalons] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [isSalonsLoading, setIsSalonsLoading] = useState(false);
  const [isDealsLoading, setIsDealsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSalons = async () => {
    setIsSalonsLoading(true);
    try {
      const { data, error } = await supabase
        .from('salons')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      setSalons(data || []);
    } catch (error: any) {
      toast.error(`Kunde inte hämta salonger: ${error.message}`);
    } finally {
      setIsSalonsLoading(false);
    }
  };

  const fetchDeals = async (salonId: string) => {
    if (!salonId) {
      setDeals([]);
      return;
    }
    
    setIsDealsLoading(true);
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('id, title')
        .eq('salon_id', salonId)
        .eq('is_active', true)
        .order('title');
        
      if (error) throw error;
      setDeals(data || []);
    } catch (error: any) {
      toast.error(`Kunde inte hämta behandlingar: ${error.message}`);
    } finally {
      setIsDealsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSalons();
      setFormData({
        title: "",
        description: "",
        compensation: "",
        salon_id: "",
        deal_id: "",
        max_creators: 5,
        expires_at: null,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.salon_id) {
      fetchDeals(formData.salon_id);
    } else {
      setDeals([]);
    }
  }, [formData.salon_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.salon_id || !formData.deal_id || !formData.title || !formData.description || !formData.compensation) {
      toast.error("Alla fält måste fyllas i");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onCreate({
        salon_id: parseInt(formData.salon_id as string, 10),
        deal_id: parseInt(formData.deal_id as string, 10),
        title: formData.title,
        description: formData.description,
        compensation: formData.compensation,
        max_creators: formData.max_creators,
        expires_at: formData.expires_at?.toISOString() || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Skapa ny samarbetsförfrågan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salon_id">Salong</Label>
              <Select 
                value={formData.salon_id} 
                onValueChange={(value) => handleSelectChange('salon_id', value)}
                disabled={isSalonsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj salong" />
                </SelectTrigger>
                <SelectContent>
                  {salons.map((salon) => (
                    <SelectItem key={salon.id} value={salon.id.toString()}>
                      {salon.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deal_id">Behandling</Label>
              <Select 
                value={formData.deal_id} 
                onValueChange={(value) => handleSelectChange('deal_id', value)}
                disabled={isDealsLoading || !formData.salon_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.salon_id ? "Välj behandling" : "Välj salong först"} />
                </SelectTrigger>
                <SelectContent>
                  {deals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id.toString()}>
                      {deal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              placeholder="T.ex. Skapa video för fillers"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description}
              onChange={handleChange}
              placeholder="Beskriv vad kreatören ska göra och förväntas leverera"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="compensation">Ersättning</Label>
            <Input 
              id="compensation" 
              name="compensation" 
              value={formData.compensation}
              onChange={handleChange}
              placeholder="T.ex. En gratis fillers-behandling (värde 2000kr)"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_creators">Antal kreatörer</Label>
              <Input 
                id="max_creators" 
                name="max_creators" 
                type="number"
                min="1"
                max="100"
                value={formData.max_creators}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Utgångsdatum (valfritt)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expires_at ? (
                      format(formData.expires_at, "yyyy-MM-dd")
                    ) : (
                      <span>Inget utgångsdatum</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expires_at || undefined}
                    onSelect={(date) => setFormData({ ...formData, expires_at: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Avbryt
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Skapar..." : "Skapa förfrågan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
