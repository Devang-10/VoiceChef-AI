-- Add customer_name column to orders table
alter table public.orders 
add column customer_name text;

-- If you want to enforce it later, you can add NOT NULL, but for existing rows it might be an issue.
-- For now, nullable is fine or default to 'Guest'.
