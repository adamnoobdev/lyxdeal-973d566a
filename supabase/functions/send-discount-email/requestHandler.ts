
import { corsHeaders } from "./corsConfig.ts";
import { sendDiscountEmail } from "./emailSender.ts";

export async function requestHandler(req: Request) {
  try {
    // Konvertera Request body till en läsbar sträng en gång
    const requestText = await req.text();
    console.log("Mottaget förfrågansinnehåll:", requestText);
    
    let requestBody;
    try {
      // Försök parsa JSON-innehållet
      requestBody = JSON.parse(requestText);
      console.log("Parsad förfrågan:", JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error("Kunde inte parsa JSON-innehåll:", parseError);
      return new Response(
        JSON.stringify({
          error: "Ogiltigt JSON-format i förfrågan",
          details: parseError.message,
          receivedText: requestText.substring(0, 100) + (requestText.length > 100 ? '...' : '')
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    const { email, name, code, dealTitle, phone, subscribedToNewsletter, bookingUrl } = requestBody;

    // Validera obligatoriska fält
    if (!email || !code || !dealTitle) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!code) missingFields.push('code');
      if (!dealTitle) missingFields.push('dealTitle');
      
      console.error(`Saknar obligatoriska fält: ${missingFields.join(', ')}`);
      return new Response(
        JSON.stringify({
          error: `Saknar obligatoriska fält: ${missingFields.join(', ')}`,
          receivedData: { email, code, dealTitle },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Bearbetar mejlförfrågan för ${email}, erbjudande "${dealTitle}", kod: ${code}`);
    if (bookingUrl) {
      console.log(`Med boknings-URL: ${bookingUrl}`);
    }
    
    // Använd sendDiscountEmail-funktionen som hanterar det faktiska mejlskickandet
    return await sendDiscountEmail({
      email,
      name: name || "Kund", // Default om namn inte tillhandahålls
      phone: phone || "",
      code,
      dealTitle,
      bookingUrl,
      subscribedToNewsletter
    });
    
  } catch (error) {
    console.error("Fel vid bearbetning av förfrågan:", error);
    console.error("Stack trace:", error.stack);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Ett okänt fel inträffade",
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
