import { useParams, useNavigate } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { DealForm } from "@/components/DealForm";
import { FormValues } from "@/components/deal-form/schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function EditDeal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading } = useDeal(id);

  const handleSubmit = async (values: FormValues) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('deals')
        .update({
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: parseInt(values.originalPrice),
          discounted_price: parseInt(values.discountedPrice),
          category: values.category,
          city: values.city,
          time_remaining: values.timeRemaining,
          featured: values.featured,
        })
        .eq('id', parseInt(id));

      if (error) throw error;

      toast.success("Erbjudandet har uppdaterats!");
      navigate("/admin/manage-deals");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Något gick fel när erbjudandet skulle uppdateras.");
    }
  };

  if (isLoading) return <div className="container mx-auto p-6">Laddar...</div>;
  if (!deal) return <div className="container mx-auto p-6">Erbjudandet hittades inte.</div>;

  const formValues: FormValues = {
    title: deal.title,
    description: deal.description,
    imageUrl: deal.imageUrl,
    originalPrice: deal.originalPrice.toString(),
    discountedPrice: deal.discountedPrice.toString(),
    category: deal.category,
    city: deal.city,
    timeRemaining: deal.timeRemaining,
    featured: deal.featured,
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Redigera Erbjudande</h1>
      <DealForm onSubmit={handleSubmit} initialValues={formValues} />
    </div>
  );
}