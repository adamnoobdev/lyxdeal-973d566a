import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealForm } from "@/components/DealForm";
import { toast } from "sonner";
import * as z from "zod";

export default function AdminPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: z.AnyZodObject) => {
    setIsSubmitting(true);
    try {
      // Här skulle vi normalt göra ett API-anrop för att spara erbjudandet
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Nytt erbjudande:", values);
      
      toast.success("Erbjudandet har skapats!");
      navigate("/");
    } catch (error) {
      toast.error("Något gick fel när erbjudandet skulle skapas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lägg till nytt erbjudande</h1>
      <DealForm onSubmit={handleSubmit} />
    </div>
  );
}