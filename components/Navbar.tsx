"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-semibold text-stone-800 hover:text-stone-600"
        >
          Ricette
        </Link>
        <div className="flex items-center gap-6">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-stone-600 hover:text-stone-800"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/saved"
                    className="text-stone-600 hover:text-stone-800"
                  >
                    Ricette salvate
                  </Link>
                  <Link
                    href="/dashboard/preferite"
                    className="text-stone-600 hover:text-stone-800"
                  >
                    Ricette preferite
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="text-stone-600 hover:text-stone-800"
                  >
                    Profilo
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-stone-600 hover:text-stone-800"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-stone-600 hover:text-stone-800"
                  >
                    Accedi
                  </Link>
                  <Link
                    href="/register"
                    className="text-stone-600 hover:text-stone-800"
                  >
                    Registrati
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
