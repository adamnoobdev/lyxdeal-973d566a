
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Adds a user to the newsletter subscribers table
 */
export const addToNewsletter = async (
  email: string,
  name: string,
  interests: string[] = ["deals"]
): Promise<boolean> => {
  try {
    // Call our edge function to add subscriber
    const { error: newsletterError } = await supabase.functions.invoke("add-newsletter-subscriber", {
      body: { email, name, interests }
    });
      
    if (newsletterError) {
      // If the error is a duplicate key violation, user is already subscribed
      if (newsletterError.message && newsletterError.message.includes("duplicate")) {
        console.log("User already subscribed to newsletter:", email);
        return true;
      } else {
        console.error("Error adding user to newsletter:", newsletterError);
        return false;
      }
    }
    
    console.log("Successfully added to newsletter:", email);
    return true;
  } catch (error) {
    console.error("Exception adding to newsletter:", error);
    return false;
  }
};
