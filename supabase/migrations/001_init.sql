-- ============================================================
-- MIGRATION 001 — Base Mailys Solutions
-- À exécuter dans Supabase : SQL Editor → New query → coller → Run
-- Tables : articles de blog, messages de contact, couleurs,
-- sections de contenu, landing pages SEA.
-- Sécurité : lecture publique du contenu publié uniquement,
-- écriture réservée aux utilisateurs authentifiés (admin).
-- ============================================================

-- ---------- Articles de blog ----------
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',          -- Markdown
  cover_url text,
  meta_title text not null default '',
  meta_description text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

create policy "blog_public_read" on blog_posts
  for select using (published = true);

create policy "blog_admin_all" on blog_posts
  for all to authenticated using (true) with check (true);

-- ---------- Messages de contact ----------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text default '',
  company text default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Le formulaire public peut déposer un message (anonyme), jamais le lire.
create policy "contact_public_insert" on contact_messages
  for insert to anon with check (true);

create policy "contact_admin_all" on contact_messages
  for all to authenticated using (true) with check (true);

-- ---------- Couleurs du site ----------
create table if not exists site_colors (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table site_colors enable row level security;

create policy "colors_public_read" on site_colors
  for select using (true);

create policy "colors_admin_all" on site_colors
  for all to authenticated using (true) with check (true);

-- ---------- Sections de contenu (textes du site) ----------
create table if not exists site_sections (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table site_sections enable row level security;

create policy "sections_public_read" on site_sections
  for select using (true);

create policy "sections_admin_all" on site_sections
  for all to authenticated using (true) with check (true);

-- ---------- Landing pages SEA ----------
create table if not exists landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  h1 text not null,
  subtitle text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table landing_pages enable row level security;

create policy "lp_public_read" on landing_pages
  for select using (published = true);

create policy "lp_admin_all" on landing_pages
  for all to authenticated using (true) with check (true);
