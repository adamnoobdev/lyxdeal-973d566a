import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface CreateCollaborationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (values: any) => Promise<boolean | void>;
}

interface Salon {
  id: number;
  name: string;
}

interface Deal {
  id: number;
  title: string;
}

export const CreateCollaborationDialog = ({ isOpen, onClose, onCreate }: CreateCollaborationDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    salon_id: "",
    deal_id: "",
    title: "",
    description: "",
    compensation: "",
    max_creators: 5
  });
  const [salons, setSalons] = useState<Salon[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'salon_id') {
      fetchDealsBySalon(value);
    }
  };
  
  const fetchDealsBySalon = async (salonId: string) => {
    if (!salonId) {
      setDeals([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('id, title')
        .eq('salon_id', parseInt(salonId, 10))
        .eq('is_active', true)
        .order('title');
        
      if (error) throw error;
      setDeals(data || []);
      
      // Reset deal_id when salon changes
      setFormData(prev => ({
        ...prev,
        deal_id: ""
      }));
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDeals([]);
    }
  };
  
  const fetchSalons = async () => {
    try {
      const { data, error } = await supabase
        .from('salons')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      setSalons(data || []);
    } catch (error) {
      console.error('Error fetching salons:', error);
      setSalons([]);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchSalons();
      setFormData({
        salon_id: "",
        deal_id: "",
        title: "",
        description: "",
        compensation: "",
        max_creators: 5
      });
    }
  }, [isOpen]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onCreate({
        salon_id: parseInt(formData.salon_id, 10),
        deal_id: parseInt(formData.deal_id, 10),
        title: formData.title,
        description: formData.description,
        compensation: formData.compensation,
        max_creators: parseInt(String(formData.max_creators), 10)
      });
    } catch (error) {
      console.error('Error creating collaboration request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Skapa samarbetsförfrågan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salon_id">Salong</Label>
            <Select 
              value={formData.salon_id} 
              onValueChange={(value) => handleSelectChange(value, 'salon_id')}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj salong" />
              </SelectTrigger>
              <SelectContent>
                {salons.map((salon) => (
                  <SelectItem key={salon.id} value={String(salon.id)}>{salon.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deal_id">Behandling</Label>
            <Select 
              value={formData.deal_id} 
              onValueChange={(value) => handleSelectChange(value, 'deal_id')}
              disabled={!formData.salon_id}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.salon_id ? "Välj behandling" : "Välj salong först"} />
              </SelectTrigger>
              <SelectContent>
                {deals.map((deal) => (
                  <SelectItem key={deal.id} value={String(deal.id)}>{deal.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows={3} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="compensation">Ersättning</Label>
            <Input 
              id="compensation" 
              name="compensation" 
              value={formData.compensation} 
              onChange={handleInputChange} 
              required 
              placeholder="T.ex. '20% rabatt på ordinarie pris'"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_creators">Antal kreatörer</Label>
            <Input 
              id="max_creators" 
              name="max_creators" 
              type="number" 
              value={formData.max_creators} 
              onChange={handleInputChange} 
              min={1}
              max={50}
              required 
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>Avbryt</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sparar...' : 'Skapa förfrågan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
