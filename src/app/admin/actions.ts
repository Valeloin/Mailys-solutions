"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/blog";
import { EDITABLE_COLORS } from "@/lib/colors";
import { getSectionDef } from "@/lib/sections";
import { deepMerge } from "@/lib/content";

// ============================================================
// Server actions de l'admin. Toutes exigent une session valide
// (le middleware protège les pages, la RLS protège la base).
// ============================================================

async function requireClient() {
  const supabase = await getServerClient();
  if (!supabase) redirect("/admin/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

// ---------- Authentification ----------

export async function login(formData: FormData): Promise<void> {
  const supabase = await getServerClient();
  if (!supabase) redirect("/admin/login?error=config");

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=identifiants");
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const supabase = await getServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Articles de blog ----------

export async function savePost(formData: FormData): Promise<void> {
  const supabase = await requireClient();

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "");
  const cover_url = String(formData.get("cover_url") || "").trim() || null;
  const meta_title = String(formData.get("meta_title") || "").trim();
  const meta_description = String(formData.get("meta_description") || "").trim();
  const published = formData.get("published") === "on";

  if (!title) redirect(`/admin/articles/${id || "nouveau"}?error=titre`);

  const slug = slugify(rawSlug || title);
  if (!slug) redirect(`/admin/articles/${id || "nouveau"}?error=slug`);

  // published_at : posé à la première publication, conservé ensuite.
  let published_at: string | null = null;
  if (published) {
    published_at = new Date().toISOString();
    if (id) {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();
      if (existing?.published_at) published_at = existing.published_at;
    }
  }

  const row = {
    title,
    slug,
    excerpt,
    content,
    cover_url,
    meta_title,
    meta_description,
    published,
    published_at,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("blog_posts").update(row).eq("id", id)
    : await supabase.from("blog_posts").insert(row);

  if (error) {
    const code = error.code === "23505" ? "slug-pris" : "sauvegarde";
    redirect(`/admin/articles/${id || "nouveau"}?error=${code}`);
  }

  // Le site public se met à jour immédiatement.
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  redirect("/admin/articles?saved=1");
}

export async function deletePost(formData: FormData): Promise<void> {
  const supabase = await requireClient();
  const id = String(formData.get("id") || "");
  const slug = String(formData.get("current_slug") || "");
  if (id) {
    await supabase.from("blog_posts").delete().eq("id", id);
    revalidatePath("/blog");
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
  }
  redirect("/admin/articles?deleted=1");
}

// ---------- Messages de contact ----------

export async function toggleMessageRead(formData: FormData): Promise<void> {
  const supabase = await requireClient();
  const id = String(formData.get("id") || "");
  const read = formData.get("read") === "true";
  if (id) {
    await supabase.from("contact_messages").update({ read: !read }).eq("id", id);
  }
  redirect("/admin/messages");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  const supabase = await requireClient();
  const id = String(formData.get("id") || "");
  if (id) {
    await supabase.from("contact_messages").delete().eq("id", id);
  }
  redirect("/admin/messages");
}

// ---------- Contenus des sections ----------

export async function saveSection(formData: FormData): Promise<void> {
  const supabase = await requireClient();

  const key = String(formData.get("key") || "");
  const def = getSectionDef(key);
  if (!def) redirect("/admin/contenus");

  const raw = String(formData.get("data") || "{}");
  // Garde-fou : une section ne peut pas dépasser 200 Ko de texte.
  if (raw.length > 200_000) {
    redirect(`/admin/contenus/${encodeURIComponent(key)}?error=format`);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    redirect(`/admin/contenus/${encodeURIComponent(key)}?error=format`);
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    redirect(`/admin/contenus/${encodeURIComponent(key)}?error=format`);
  }

  // Normalisation par les défauts : seules les clés connues du
  // schéma sont conservées, les structures malformées sont
  // corrigées AVANT stockage — la base ne contient jamais de
  // données capables de casser une page publique.
  const cleaned = deepMerge(def.defaults, data);

  const { error } = await supabase
    .from("site_sections")
    .upsert({ key, data: cleaned, updated_at: new Date().toISOString() });
  if (error) {
    redirect(`/admin/contenus/${encodeURIComponent(key)}?error=sauvegarde`);
  }

  // Tout le site est régénéré avec les nouveaux textes.
  revalidatePath("/", "layout");
  redirect(`/admin/contenus/${encodeURIComponent(key)}?saved=1`);
}

export async function resetSection(formData: FormData): Promise<void> {
  const supabase = await requireClient();
  const key = String(formData.get("key") || "");
  if (getSectionDef(key)) {
    const { error } = await supabase
      .from("site_sections")
      .delete()
      .eq("key", key);
    if (error) {
      redirect(`/admin/contenus/${encodeURIComponent(key)}?error=sauvegarde`);
    }
    revalidatePath("/", "layout");
  }
  redirect(`/admin/contenus/${encodeURIComponent(key)}?reset=1`);
}

// ---------- Couleurs ----------

export async function saveColors(formData: FormData): Promise<void> {
  const supabase = await requireClient();

  const rows = EDITABLE_COLORS.map((c) => {
    const value = String(formData.get(`color_${c.key}`) || "").trim().toLowerCase();
    return /^#[0-9a-f]{6}$/.test(value)
      ? { key: c.key, value, updated_at: new Date().toISOString() }
      : null;
  }).filter(Boolean) as { key: string; value: string; updated_at: string }[];

  if (rows.length > 0) {
    const { error } = await supabase.from("site_colors").upsert(rows);
    if (error) redirect("/admin/couleurs?error=sauvegarde");
  }

  // Regénère tout le site avec la nouvelle palette.
  revalidatePath("/", "layout");
  redirect("/admin/couleurs?saved=1");
}
