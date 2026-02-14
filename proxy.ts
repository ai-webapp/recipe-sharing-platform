import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy: aggiorna la sessione Supabase (refresh del token) e scrive
 * i cookie nella response. Non reindirizza alla login: le pagine pubbliche
 * (home, ricette) restano accessibili a tutti.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return response;
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Aggiorna la sessione (refresh token). Importante per non far sloggare l'utente.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Esegui il proxy su tutte le route tranne:
     * - _next/static, _next/image, favicon.ico
     * - file statici (svg, png, ecc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
