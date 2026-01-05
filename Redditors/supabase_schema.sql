-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Accounts (The Reddit users we control)
create table accounts (
  id uuid primary key default uuid_generate_v4(),
  username text not null unique,
  -- We store credentials encrypted or just rely on env vars if small scale. 
  -- For now, let's assume credentials are in Env Vars mapping Username -> Creds, 
  -- and this table is for state.
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: Personas (The personality/system prompt)
create table personas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  system_prompt text not null,
  -- configuration: e.g. {"reply_probability": 0.2, "topics": ["tech", "news"]}
  config jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Link Accounts to Personas (One account uses One persona at a time)
alter table accounts add column current_persona_id uuid references personas(id);

-- Table: Targets (Subreddits to monitor)
create table targets (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references accounts(id) on delete cascade,
  subreddit text not null,
  -- e.g. "poll_new" or "poll_hot"
  last_scanned_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: History (What have we done?)
create table history (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references accounts(id),
  action_type text not null, -- 'comment', 'post'
  reddit_id text not null, -- 't1_...', 't3_...'
  content text, -- what we wrote
  permalink text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes
create index idx_history_reddit_id on history(reddit_id);
create index idx_targets_account_id on targets(account_id);
