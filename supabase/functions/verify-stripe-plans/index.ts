
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.11.0";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_CONFIGS = [
  {
    name: "Baspaket - Månadsbetalning",
    id: "baspaket-monthly",
    interval: "month",
    price: 399,
    currency: "sek",
    metadata: {
      plan_title: "Baspaket",
      plan_type: "monthly",
      deal_count: "1"
    }
  },
  {
    name: "Baspaket - Årsbetalning",
    id: "baspaket-yearly",
    interval: "year",
    price: 3588,
    currency: "sek",
    metadata: {
      plan_title: "Baspaket",
      plan_type: "yearly",
      deal_count: "1"
    }
  },
  {
    name: "Premiumpaket - Månadsbetalning",
    id: "premiumpaket-monthly",
    interval: "month",
    price: 699,
    currency: "sek",
    metadata: {
      plan_title: "Premiumpaket",
      plan_type: "monthly",
      deal_count: "3"
    }
  },
  {
    name: "Premiumpaket - Årsbetalning",
    id: "premiumpaket-yearly",
    interval: "year",
    price: 6288,
    currency: "sek",
    metadata: {
      plan_title: "Premiumpaket",
      plan_type: "yearly",
      deal_count: "3"
    }
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
      maxNetworkRetries: 3,
    });

    console.log("Verifying Stripe subscription plans...");
    const products = await stripe.products.list({ active: true });
    const prices = await stripe.prices.list({ active: true });
    
    // Track which plans need to be created
    const plansToCreate = [...PLAN_CONFIGS];
    const existingPlans = [];
    const createdPlans = [];
    
    // Check if plans already exist
    for (const planConfig of PLAN_CONFIGS) {
      // Look for existing product with this ID
      const existingProduct = products.data.find(p => 
        p.metadata?.plan_id === planConfig.id
      );
      
      if (existingProduct) {
        // Check if price exists with correct amount and interval
        const existingPrice = prices.data.find(price => 
          price.product === existingProduct.id && 
          price.recurring?.interval === planConfig.interval &&
          price.unit_amount === planConfig.price * 100
        );
        
        if (existingPrice) {
          existingPlans.push({
            product: existingProduct,
            price: existingPrice,
            config: planConfig
          });
          
          // Remove from plans to create list
          const index = plansToCreate.findIndex(p => p.id === planConfig.id);
          if (index !== -1) {
            plansToCreate.splice(index, 1);
          }
        }
      }
    }
    
    console.log(`Found ${existingPlans.length} existing plans. Need to create ${plansToCreate.length} plans.`);
    
    // Create missing plans
    for (const planConfig of plansToCreate) {
      console.log(`Creating plan: ${planConfig.name}`);
      
      // Create the product
      const product = await stripe.products.create({
        name: planConfig.name,
        metadata: {
          ...planConfig.metadata,
          plan_id: planConfig.id
        }
      });
      
      // Create the price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: planConfig.price * 100,
        currency: planConfig.currency,
        recurring: {
          interval: planConfig.interval
        },
        metadata: planConfig.metadata
      });
      
      createdPlans.push({
        product,
        price,
        config: planConfig
      });
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Verified subscription plans. Found ${existingPlans.length} existing plans, created ${createdPlans.length} new plans.`,
        existingPlans: existingPlans.map(p => ({
          name: p.product.name,
          price: p.price.unit_amount / 100,
          currency: p.price.currency,
          interval: p.price.recurring?.interval,
          price_id: p.price.id
        })),
        createdPlans: createdPlans.map(p => ({
          name: p.product.name,
          price: p.price.unit_amount / 100,
          currency: p.price.currency,
          interval: p.price.recurring?.interval,
          price_id: p.price.id
        }))
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error(`Error verifying plans: ${error.message}`);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
