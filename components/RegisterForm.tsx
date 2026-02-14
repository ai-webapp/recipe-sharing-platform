"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim() || undefined,
          user_name: userName.trim(),
          about_me: aboutMe.trim() || undefined,
        },
      },
    });
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          full_name: fullName.trim() || null,
          user_name: userName.trim() || null,
          about_me: aboutMe.trim() || null,
        },
        { onConflict: "id" }
      );
    }
    setLoading(false);
    setSuccess(true);
    router.refresh();
  }

  if (success) {
    return (
      <div className="w-full max-w-sm rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-green-800">
        <p className="font-medium">Registrazione completata</p>
        <p className="mt-1 text-sm">
          <Link href="/login" className="font-medium underline hover:text-green-900">
            Accedi
          </Link>{" "}
          per entrare nel tuo account.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="user_name" className="mb-1 block text-sm font-medium text-stone-700">
            Nome per la pubblicazione <span className="text-red-600">*</span>
          </label>
          <input
            id="user_name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            autoComplete="username"
            placeholder="Mario Rossi"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
          <p className="mt-1 text-xs text-stone-500">
            Nome che apparirà sulle tue ricette (obbligatorio).
          </p>
        </div>
        <div>
          <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-stone-700">
            Nome e cognome (opzionale)
          </label>
          <input
            id="full_name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            placeholder="Mario Rossi"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label htmlFor="about_me" className="mb-1 block text-sm font-medium text-stone-700">
            Presentati alla community (opzionale)
          </label>
          <textarea
            id="about_me"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={3}
            placeholder="Qualche riga su di te, le tue passioni in cucina..."
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
          <p className="mt-1 text-xs text-stone-500">Almeno 6 caratteri</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-stone-800 px-4 py-2 font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {loading ? "Registrazione in corso…" : "Registrati"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-stone-600">
        Hai già un account?{" "}
        <Link href="/login" className="font-medium text-stone-800 underline hover:text-stone-600">
          Accedi
        </Link>
      </p>
    </div>
  );
}
