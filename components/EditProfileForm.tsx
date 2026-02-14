"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  userId: string;
  initialFullName: string | null;
  initialUserName: string | null;
  initialAboutMe?: string | null;
};

export default function EditProfileForm({
  userId,
  initialFullName,
  initialUserName,
  initialAboutMe = null,
}: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [userName, setUserName] = useState(initialUserName ?? "");
  const [aboutMe, setAboutMe] = useState(initialAboutMe ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: fullName.trim() || null,
          user_name: userName.trim() || null,
          about_me: aboutMe.trim() || null,
        },
        { onConflict: "id" }
      );
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            Profilo aggiornato.
          </p>
        )}
        <div>
          <label
            htmlFor="full_name"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Nome e cognome
          </label>
          <input
            id="full_name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Mario Rossi"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label
            htmlFor="user_name"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Nome utente
          </label>
          <input
            id="user_name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="mariorossi"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
          <p className="mt-1 text-xs text-stone-500">
            Nome visualizzato sulle tue ricette (es. @mariorossi).
          </p>
        </div>
        <div>
          <label
            htmlFor="about_me"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Presentati alla community
          </label>
          <textarea
            id="about_me"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={4}
            placeholder="Qualche riga su di te, le tue passioni in cucina..."
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-stone-800 px-4 py-2 font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {loading ? "Salvataggio…" : "Salva profilo"}
        </button>
      </form>
      <p className="mt-4">
        <Link
          href="/dashboard"
          className="text-sm text-stone-600 underline hover:text-stone-800"
        >
          ← Torna alla dashboard
        </Link>
      </p>
    </div>
  );
}
