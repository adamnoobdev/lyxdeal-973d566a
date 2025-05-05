
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
    // First check if user is authenticated, as this affects how we handle the subscription
    const { data: authData } = await supabase.auth.getSession();
    const isAuthenticated = !!authData.session;

    // If user is not authenticated, we need to use the edge function
    // which has the necessary permissions to add subscribers
    if (!isAuthenticated) {
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
    } else {
      // User is authenticated, can use direct insert (RLS policy allows this)
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, name, interests }]);
        
      if (insertError) {
        // If the error is a duplicate key violation, user is already subscribed
        if (insertError.message && insertError.message.includes("duplicate")) {
          console.log("User already subscribed to newsletter:", email);
          return true;
        } else {
          console.error("Error adding user to newsletter:", insertError);
          return false;
        }
      }
    }
    
    console.log("Successfully added to newsletter:", email);
    return true;
  } catch (error) {
    console.error("Exception adding to newsletter:", error);
    return false;
  }
};
