-- Add user_id column to orders table
ALTER TABLE public.orders 
ADD COLUMN user_id UUID;

--  Optional: Add foreign key constraint if you want to enforce existence in auth.users
-- ALTER TABLE public.orders
-- ADD CONSTRAINT fk_user
-- FOREIGN KEY (user_id) 
-- REFERENCES auth.users (id);
