-- ============================================================
-- MIGRATION 002 — Durcissement de la sécurité (RLS)
-- À exécuter dans Supabase : SQL Editor → coller → Run.
--
-- Problème corrigé : les policies « to authenticated » de la
-- migration 001 donnaient les droits d'écriture à N'IMPORTE QUEL
-- compte Supabase. Si les inscriptions publiques sont ouvertes,
-- un inconnu pourrait créer un compte et modifier le site.
-- Désormais : seuls les emails listés dans is_admin() peuvent
-- écrire. ⚠️ PENSER AUSSI à désactiver les inscriptions :
-- Dashboard → Authentication → Sign In / Providers →
-- décocher « Allow new users to sign up ».
-- ============================================================

-- Liste des administrateurs autorisés (ajouter le client ici le jour venu).
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() ->> 'email') in (
      'v.condamy@gmail.com'
    ),
    false
  );
$$;

-- ---------- blog_posts ----------
drop policy if exists "blog_admin_all" on blog_posts;
create policy "blog_admin_all" on blog_posts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- contact_messages ----------
drop policy if exists "contact_admin_all" on contact_messages;
create policy "contact_admin_all" on contact_messages
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- site_colors ----------
drop policy if exists "colors_admin_all" on site_colors;
create policy "colors_admin_all" on site_colors
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- site_sections ----------
drop policy if exists "sections_admin_all" on site_sections;
create policy "sections_admin_all" on site_sections
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- landing_pages ----------
drop policy if exists "lp_admin_all" on landing_pages;
create policy "lp_admin_all" on landing_pages
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
