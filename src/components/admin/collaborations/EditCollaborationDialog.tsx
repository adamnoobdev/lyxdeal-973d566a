
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CollaborationRequest } from "@/types/collaboration";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface EditCollaborationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (values: any, id: string) => Promise<void>;
  collaborationRequest: CollaborationRequest;
}

export const EditCollaborationDialog = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  collaborationRequest 
}: EditCollaborationDialogProps) => {
  const [formData, setFormData] = useState({
    title: collaborationRequest.title,
    description: collaborationRequest.description,
    compensation: collaborationRequest.compensation,
    max_creators: collaborationRequest.max_creators,
    status: collaborationRequest.status,
    expires_at: collaborationRequest.expires_at ? new Date(collaborationRequest.expires_at) : null as Date | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && collaborationRequest) {
      setFormData({
        title: collaborationRequest.title,
        description: collaborationRequest.description,
        compensation: collaborationRequest.compensation,
        max_creators: collaborationRequest.max_creators,
        status: collaborationRequest.status,
        expires_at: collaborationRequest.expires_at ? new Date(collaborationRequest.expires_at) : null,
      });
    }
  }, [isOpen, collaborationRequest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.compensation) {
      toast.error("Alla fält måste fyllas i");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onUpdate({
        title: formData.title,
        description: formData.description,
        compensation: formData.compensation,
        max_creators: formData.max_creators,
        status: formData.status,
        expires_at: formData.expires_at?.toISOString() || null,
        updated_at: new Date().toISOString()
      }, collaborationRequest.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Redigera samarbetsförfrågan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Salong</Label>
              <Input value={collaborationRequest.salon_name || ''} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Behandling</Label>
              <Input value={collaborationRequest.deal_title || ''} disabled />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description}
              onChange={handleChange}
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
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_creators">Antal kreatörer</Label>
              <Input 
                id="max_creators" 
                name="max_creators" 
                type="number"
                min={collaborationRequest.current_creators}
                max="100"
                value={formData.max_creators}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="completed">Avslutad</SelectItem>
                  <SelectItem value="cancelled">Avbruten</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Utgångsdatum</Label>
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
              {isSubmitting ? "Sparar..." : "Spara ändringar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
