
import { getSupabaseAdmin } from "../supabaseClient.ts";
import { createSalonAccount } from "./createSalonAccount.ts";
import { updatePartnerRequestStatus } from "./updatePartnerRequest.ts";
import { sendWelcomeEmail } from "./sendWelcomeEmail.ts";
import { createSalonRecord, setupFirstLoginTracking } from "./salonCreation.ts";
import { 
  getSubscriptionDetails, 
  formatSubscriptionData, 
  generateRandomPassword 
} from "./subscriptionHelpers.ts";

export async function handleCheckoutCompleted(session: any) {
  console.log("Checkout-session slutförd:", session.id);
  console.log("Fullständigt session-objekt:", JSON.stringify(session, null, 2));
  
  if (!session.metadata || !session.metadata.email || !session.metadata.business_name) {
    console.error("Saknar obligatorisk metadata i session:", JSON.stringify(session.metadata || {}, null, 2));
    throw new Error("Saknar obligatorisk metadata i session");
  }
  
  const supabaseAdmin = getSupabaseAdmin();
  
  try {
    // Först, uppdatera partner-förfrågan med session-ID
    try {
      console.log("Uppdaterar partner-förfrågan med session-ID:", session.id);
      console.log("För e-post:", session.metadata.email);
      
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from("partner_requests")
        .update({ 
          stripe_session_id: session.id,
          status: "approved"
        })
        .eq("email", session.metadata.email)
        .select();
        
      if (updateError) {
        console.error("Fel vid uppdatering av partner-förfrågan med session-ID:", updateError);
      } else {
        console.log("Partner-förfrågan uppdaterad med session-ID:", updateData);
      }
    } catch (updateError) {
      console.error("Undantag vid uppdatering av partner-förfrågan:", updateError);
      // Fortsätt trots fel
    }
    
    // Hämta prenumerationsinformation från Stripe
    let subscription = null;
    try {
      if (session.subscription) {
        console.log("Hämtar prenumerationsdetaljer från Stripe för:", session.subscription);
        subscription = await getSubscriptionDetails(session.subscription);
        console.log("Prenumerationsdetaljer:", JSON.stringify(subscription, null, 2));
      } else {
        console.log("Ingen prenumerations-ID i sessionen, hoppar över prenumerationsdetaljer");
      }
    } catch (subscriptionError) {
      console.error("Fel vid hämtning av Stripe-prenumeration:", subscriptionError);
      // Fortsätt utan prenumerationsdetaljer
    }
    
    // Generera ett säkert slumpmässigt lösenord
    const password = generateRandomPassword();
    console.log(`Genererat säkert lösenord med längd: ${password.length}`);
    
    // Börja transaktion - vi försöker skapa allt på ett konsekvent sätt
    console.log("Påbörjar kontoregistrering för:", session.metadata.email);
    
    // Skapa ett nytt salongskonto med förenklad metod
    console.log("Skapar salongskonto för:", session.metadata.email);
    const userData = await createSalonAccount(supabaseAdmin, session, password);
    
    if (!userData || !userData.user) {
      console.error("Kunde inte skapa salongskonto: Ingen användardata returnerades");
      throw new Error("Kunde inte skapa salongskonto: Ingen användardata returnerades");
    }
    
    console.log("Användare/salongskonto bearbetat framgångsrikt med ID:", userData.user.id);
    console.log("Användardata:", JSON.stringify(userData, null, 2));
    
    // Hämta prenumerationsdata
    const subscriptionData = formatSubscriptionData(session, subscription);
    console.log("Formaterad prenumerationsdata:", JSON.stringify(subscriptionData, null, 2));
    
    // Skapa/uppdatera salongspost
    console.log("Skapar/uppdaterar salongspost");
    const salonData = await createSalonRecord(supabaseAdmin, session, userData, subscriptionData);
    console.log("Salongsdata efter skapande/uppdatering:", JSON.stringify(salonData, null, 2));
    
    // Uppdatera status för partner-förfrågan
    try {
      console.log("Uppdaterar status för partner-förfrågan för:", session.metadata.email);
      const partnerResult = await updatePartnerRequestStatus(supabaseAdmin, session.metadata.email);
      console.log("Resultat för uppdatering av partner-förfrågan:", partnerResult);
    } catch (partnerError) {
      console.error("Fel vid uppdatering av partner-förfrågan:", partnerError);
      // Ej blockerande - fortsätt med kontoskapande
    }
    
    // Skicka välkomstmail med temporärt lösenord
    console.log("Skickar välkomstmail till:", session.metadata.email);
    let emailResult;
    try {
      emailResult = await sendWelcomeEmail(session, password, subscription);
      
      if (!emailResult.success) {
        console.error("Kunde inte skicka välkomstmail:", emailResult.error);
        // Logga men fortsätt med kontoskapande
      } else {
        console.log("Välkomstmail skickat framgångsrikt");
      }
    } catch (emailError) {
      console.error("Undantag vid skickande av välkomstmail:", emailError);
      emailResult = { success: false, error: emailError.message };
      // Ej blockerande - fortsätt med kontoskapande
    }
    
    // Kontrollera första inloggningsspårning
    const loginTrackingResult = await setupFirstLoginTracking(supabaseAdmin, userData.user.id);
    console.log("Resultat för första inloggningsspårning:", loginTrackingResult);
    
    return { 
      success: true, 
      userId: userData.user.id,
      salonCreated: true,
      emailSent: emailResult?.success || false,
      email: session.metadata.email,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Kritiskt fel i handleCheckoutCompleted:", error);
    console.error("Felstack:", error.stack);
    // Kasta om för att säkerställa att webhook-bearbetning misslyckas och kan försökas igen
    throw error;
  }
}
