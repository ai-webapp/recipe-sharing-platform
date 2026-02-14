"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Elimina l'account dell'utente. Richiede che l'utente sia autenticato.
 * Supabase Auth non espone deleteUser lato client; questa action effettua
 * il sign out. Per eliminazione effettiva dell'account, configurare una
 * Edge Function Supabase o usare il pannello Admin.
 */
export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Nessun utente autenticato." };
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login?deleted=1");
}
