
-- Add skip_subscription column to salons table if it doesn't exist
ALTER TABLE public.salons 
ADD COLUMN IF NOT EXISTS skip_subscription BOOLEAN DEFAULT false;

-- Make sure existing records have a default value
UPDATE public.salons 
SET skip_subscription = false
WHERE skip_subscription IS NULL;
