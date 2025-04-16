
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDealOptions } from "@/hooks/useDealOptions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateCollaborationDialogProps {
  salonId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  dealId: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Välj ett erbjudande",
  }),
  title: z.string().min(5, {
    message: "Titeln måste vara minst 5 tecken",
  }),
  description: z.string().min(10, {
    message: "Beskrivningen måste vara minst 10 tecken",
  }),
  compensation: z.string().min(5, {
    message: "Beskriv ersättningen med minst 5 tecken",
  }),
  maxCreators: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Ange ett positivt heltal",
  }),
});

export function CreateCollaborationDialog({
  salonId,
  isOpen,
  onClose,
  onSuccess,
}: CreateCollaborationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dealOptions, isLoading: isLoadingDeals } = useDealOptions(salonId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      compensation: "",
      maxCreators: "5", // Default max antal kreatörer
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!salonId) {
      toast.error("Kunde inte identifiera salongen.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Skapa en ny samarbetsförfrågan i databasen
      const { data, error } = await supabase.from("collaboration_requests").insert({
        salon_id: salonId,
        deal_id: parseInt(values.dealId),
        title: values.title,
        description: values.description,
        compensation: values.compensation,
        max_creators: parseInt(values.maxCreators),
        status: "active",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dagar från nu
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Samarbetsförfrågan skapad!");
      onSuccess();
    } catch (error) {
      console.error("Error creating collaboration request:", error);
      toast.error("Kunde inte skapa samarbetsförfrågan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Skapa samarbetsförfrågan</DialogTitle>
          <DialogDescription>
            Skapa en förfrågan om samarbete som kreatörer kan ansöka till.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dealId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Erbjudande</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingDeals || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj ett erbjudande" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dealOptions.map((deal) => (
                        <SelectItem key={deal.value} value={deal.value}>
                          {deal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Samarbetsförfrågan titel"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beskrivning</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beskriv samarbetet och vad du söker hos kreatörer"
                      className="min-h-[100px]"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compensation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ersättning</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beskriv vad kreatören får i ersättning"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxCreators"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max antal kreatörer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Skapar...
                  </>
                ) : (
                  "Skapa samarbete"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
