import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase per Componenti Client (browser).
 * Usa questo in componenti con "use client" quando devi leggere/scrivere dati
 * o gestire auth (login, logout, ecc.) dal browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
