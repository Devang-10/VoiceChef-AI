-- Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  items jsonb not null,
  customer_phone text not null,
  total_price numeric not null,
  status text default 'pending' check (status in ('pending', 'completed'))
);

-- Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- Create Policy to allow read access for all (for dashboard)
-- In a real app, you might restrict this to authenticated users
create policy "Enable read access for all users"
on "public"."orders"
as PERMISSIVE
for SELECT
to public
using (true);

-- Create Policy to allow insert via Service Role only (Backend)
-- Actually, RLS applies to the anon/authenticated roles. Service role bypasses RLS.
-- But we can add a policy for anon inserts just in case, though we will use Service Key in backend.
