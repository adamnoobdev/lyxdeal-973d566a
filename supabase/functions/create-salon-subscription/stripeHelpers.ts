
import Stripe from "https://esm.sh/stripe@12.11.0";
import { corsHeaders } from "./corsConfig.ts";

export async function createStripeCustomer(stripe: Stripe, email: string, businessName: string, planTitle: string, planType: string) {
  try {
    console.log("Creating Stripe customer for:", email);
    const customer = await stripe.customers.create({
      email,
      name: businessName,
      metadata: {
        plan_title: planTitle,
        plan_type: planType,
      },
    });
    console.log("Created Stripe customer:", customer.id);
    return { success: true, customer };
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw new Response(
      JSON.stringify({ 
        error: "Failed to create Stripe customer",
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function createCheckoutSession(
  stripe: Stripe, 
  customer: Stripe.Customer, 
  planTitle: string, 
  planType: string, 
  price: number, 
  businessName: string, 
  email: string, 
  origin: string
) {
  try {
    // Logga parametrar för felsökning
    console.log("Creating checkout session with params:", {
      customer: customer.id,
      planTitle,
      planType,
      price,
      businessName,
      email,
      origin
    });
    
    // Förbättrad konfiguration av checkout session med fler detaljer
    const sessionParams = {
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: `${planTitle} - ${planType === "yearly" ? "Årsbetalning" : "Månadsbetalning"}`,
              description: `Prenumeration på ${planTitle} med ${planType === "yearly" ? "årsbetalning" : "månadsbetalning"}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents, ensure integer
            recurring: {
              interval: planType === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/partner`,
      metadata: {
        business_name: businessName,
        email,
        plan_title: planTitle,
        plan_type: planType,
      },
      locale: "sv",
      allow_promotion_codes: true, // Enable promotion codes directly in Stripe UI
      billing_address_collection: "auto",
      payment_method_collection: "always",
      custom_text: {
        submit: {
          message: "Vi kommer att skapa ditt salongskonto efter betalningen är genomförd."
        }
      }
    };
    
    console.log("Creating Stripe checkout session with params:", JSON.stringify(sessionParams));
    
    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("Created checkout session:", session.id);
    console.log("Full session object:", JSON.stringify(session));

    if (!session.url) {
      throw new Error("No checkout URL returned from Stripe");
    }
    
    console.log("Checkout URL:", session.url);
    return session;
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw new Response(
      JSON.stringify({ 
        error: "Failed to create Stripe checkout session",
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function setupPromoCode(stripe: Stripe) {
  try {
    console.log("Checking for existing promo code");
    
    // Check if the promotion code already exists
    const existingPromoCodes = await stripe.promotionCodes.list({
      code: 'provmanad',
      active: true,
      limit: 1
    });

    if (existingPromoCodes.data.length === 0) {
      console.log("No existing promo code found, creating a new one");
      // Create a coupon for 100% off first month
      const coupon = await stripe.coupons.create({
        duration: 'once',
        percent_off: 100,
        name: 'Gratis provmånad',
      });
      console.log("Created new coupon:", coupon.id);

      // Create a promotion code for the coupon
      const promoCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: 'provmanad',
        active: true,
        metadata: {
          description: 'Gratis provmånad för nya salongspartners'
        }
      });
      console.log("Created new promo code:", promoCode.id);
    } else {
      console.log("Using existing promo code:", existingPromoCodes.data[0].id);
    }
  } catch (error) {
    console.error("Error with promotion code creation:", error);
    // Continue even if promo code creation failed - this is not critical
  }
}
