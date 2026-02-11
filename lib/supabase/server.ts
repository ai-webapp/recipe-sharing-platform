import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase per Server Components, Server Actions e Route Handlers.
 * Usa questo nelle page.tsx (server), in Server Actions e in API routes.
 * Legge/scrive i cookie della sessione per mantenere l’utente loggato.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chiamato da un Server Component: i cookie non si possono
            // scrivere qui; il middleware si occupa di aggiornare la sessione.
          }
        },
      },
    }
  );
}
