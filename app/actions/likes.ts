"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Mette o toglie il "mi piace" sulla ricetta. Solo utenti autenticati.
 * Restituisce { error } in caso di errore.
 */
export async function toggleLike(recipeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Devi effettuare l'accesso per mettere mi piace." };
  }

  const { data: existing } = await supabase
    .from("recipe_likes")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("recipe_likes")
      .delete()
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("recipe_likes").insert({
      recipe_id: recipeId,
      user_id: user.id,
    });
    if (error) return { error: error.message };
  }

  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath("/dashboard");
  return {};
}
