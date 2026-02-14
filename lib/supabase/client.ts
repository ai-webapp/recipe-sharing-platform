import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client Supabase per Componenti Client (browser).
 * Usa questo in componenti con "use client" quando devi leggere/scrivere dati
 * o gestire auth (login, logout, ecc.) dal browser.
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Mancano le variabili Supabase. Su Vercel: imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in Settings → Environment Variables, poi fai Redeploy."
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
