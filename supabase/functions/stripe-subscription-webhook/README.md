
# Stripe Subscription Webhook

This Edge Function handles Stripe webhook events related to subscription management. It validates webhook signatures, processes checkout session completion, creates salon accounts, and sends welcome emails.

## File Structure

- `index.ts` - Main entry point for the webhook handler
- `corsConfig.ts` - CORS configuration for cross-origin requests
- `stripeClient.ts` - Stripe client initialization
- `supabaseClient.ts` - Supabase client initialization
- `eventHandler.ts` - Main event handler dispatcher
- `/eventHandlers/` - Specific event handlers:
  - `checkoutCompleted.ts` - Handles checkout.session.completed event
  - `createSalonAccount.ts` - Creates salon user account
  - `updatePartnerRequest.ts` - Updates partner request status
  - `sendWelcomeEmail.ts` - Sends welcome email to new salons

## Webhook Events

Currently handled events:
- `checkout.session.completed` - Processes successful subscription checkout

## Requirements

Environment variables:
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `SUPABASE_URL` - Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_ANON_KEY` - Supabase anonymous key
