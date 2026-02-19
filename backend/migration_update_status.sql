-- Drop the existing check constraint if it exists (Supabase/Postgres specific)
-- We might need to check the constraint name first, but commonly it's orders_status_check
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new check constraint
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'received', 'cooking', 'ready', 'completed', 'cancelled'));

-- Comment on column
COMMENT ON COLUMN public.orders.status IS 'Order status: pending, received, cooking, ready, completed, cancelled';
