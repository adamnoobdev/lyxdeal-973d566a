
-- Function to create a creator partnership
CREATE OR REPLACE FUNCTION public.create_creator_partnership(
  p_creator_id UUID,
  p_salon_id BIGINT, 
  p_deal_id BIGINT, 
  p_discount_code TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.creator_partnerships (
    creator_id, 
    salon_id,
    deal_id,
    discount_code,
    status,
    created_at
  ) VALUES (
    p_creator_id,
    p_salon_id,
    p_deal_id,
    p_discount_code,
    'approved',
    now()
  );
END;
$$;
