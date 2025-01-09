# Stripe Webhook Handler

This Edge Function handles Stripe webhook events, specifically for completed checkout sessions. When a payment is successful, it updates the quantity of the purchased deal in the database.

## Configuration

Make sure to set up the following secrets in your Supabase project:

1. STRIPE_SECRET_KEY - Your Stripe secret key
2. STRIPE_WEBHOOK_SECRET - The webhook signing secret from Stripe

## Webhook URL

The webhook URL will be:
`https://[PROJECT_REF].supabase.co/functions/v1/stripe-webhook`

Configure this URL in your Stripe Dashboard under Developers > Webhooks.