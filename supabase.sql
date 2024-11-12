create table blips (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  quadrant text not null check (quadrant in ('Techniques', 'Tools', 'Platforms', 'Languages & Frameworks')),
  ring text not null check (ring in ('Adopt', 'Trial', 'Assess', 'Hold')),
  description text,
  owner text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table blips enable row level security;

-- Create a policy that allows anonymous access
create policy "Allow anonymous access"
  on blips
  for all
  to anon
  using (true)
  with check (true);
