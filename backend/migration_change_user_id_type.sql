-- Change user_id from UUID to TEXT to support temporary guest IDs
ALTER TABLE public.orders 
ALTER COLUMN user_id TYPE TEXT;

-- Update RLS policy if needed (existing one is "Enable read access for all users" using true, so it's fine)
