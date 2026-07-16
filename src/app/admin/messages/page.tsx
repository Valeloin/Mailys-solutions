import { getServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/blog";
import { toggleMessageRead, deleteMessage } from "../actions";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  read: boolean;
  created_at: string;
};

// Boîte de réception des demandes de contact.
export default async function AdminMessagesPage() {
  const supabase = await getServerClient();

  let messages: ContactMessage[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    messages = (data ?? []) as ContactMessage[];
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-bordeaux">Messages reçus</h1>

      {messages.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-coral bg-background p-8 text-center">
          <p className="font-semibold text-bordeaux">Aucun message pour l&apos;instant</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Les demandes envoyées depuis le formulaire de contact du site
            apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((m) => (
            <details
              key={m.id}
              className={`group rounded-xl border bg-background p-4 ${
                m.read ? "border-border" : "border-coral"
              }`}
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0">
                  <p className={`${m.read ? "font-medium" : "font-bold"}`}>
                    {m.name}
                    {m.company && (
                      <span className="text-muted"> — {m.company}</span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {formatDate(m.created_at)} · {m.email}
                    {m.phone && ` · ${m.phone}`}
                  </p>
                </div>
                {!m.read && (
                  <span className="rounded-full bg-orange/10 px-2.5 py-1 text-xs font-bold text-orange-text">
                    Nouveau
                  </span>
                )}
              </summary>
              <div className="mt-4 border-t border-border pt-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {m.message}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${m.email}`}
                    className="btn-cta rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  >
                    Répondre par email
                  </a>
                  <form action={toggleMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={String(m.read)} />
                    <button
                      type="submit"
                      className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-colors hover:border-coral"
                    >
                      {m.read ? "Marquer non lu" : "Marquer lu"}
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      className="text-sm font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
