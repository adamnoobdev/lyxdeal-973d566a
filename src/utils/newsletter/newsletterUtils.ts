
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
    // Attempt to add the user to the newsletter table
    const { error: newsletterError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: email,
        name: name,
        interests: interests
      });
      
    if (newsletterError) {
      // If the error is a duplicate key violation, user is already subscribed
      if (newsletterError.message.includes("duplicate")) {
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
