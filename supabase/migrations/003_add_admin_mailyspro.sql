-- ============================================================
-- MIGRATION 003 — Ajout d'un administrateur
-- À exécuter dans Supabase : SQL Editor → coller → Run.
--
-- Ajoute mailyscondamy.pro@gmail.com à la liste des admins
-- autorisés (droits d'écriture RLS). Doit rester aligné avec
-- ADMIN_EMAILS dans src/lib/site.ts (verrou du middleware).
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() ->> 'email') in (
      'v.condamy@gmail.com',
      'mailyscondamy.pro@gmail.com'
    ),
    false
  );
$$;
