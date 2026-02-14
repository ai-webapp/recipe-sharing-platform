"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const EDIT_WINDOW_MS = 30 * 60 * 1000; // 30 minuti

function withinEditWindow(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < EDIT_WINDOW_MS;
}

/**
 * Aggiunge un commento alla ricetta. Solo utenti autenticati.
 */
export async function addComment(recipeId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Devi effettuare l'accesso per commentare." };
  }

  const content = (formData.get("content") as string)?.trim();
  if (!content) {
    return { error: "Scrivi un commento." };
  }

  const { error } = await supabase.from("recipe_comments").insert({
    recipe_id: recipeId,
    user_id: user.id,
    content,
  });

  if (error) return { error: error.message };

  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}

/**
 * Modifica un commento. Solo l'autore può modificare, entro 30 minuti dalla creazione.
 */
export async function updateComment(
  commentId: string,
  recipeId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Devi effettuare l'accesso." };
  }

  const content = (formData.get("content") as string)?.trim();
  if (!content) {
    return { error: "Scrivi un commento." };
  }

  const { data: comment } = await supabase
    .from("recipe_comments")
    .select("created_at")
    .eq("id", commentId)
    .eq("user_id", user.id)
    .single();

  if (!comment) {
    return { error: "Commento non trovato o non puoi modificarlo." };
  }
  if (!withinEditWindow(comment.created_at)) {
    return { error: "Il tempo per modificare questo commento è scaduto (30 minuti)." };
  }

  const { error } = await supabase
    .from("recipe_comments")
    .update({ content })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}

/**
 * Elimina un commento. Il proprietario della ricetta può sempre eliminare;
 * l'autore del commento può eliminare solo entro 30 minuti.
 */
export async function deleteComment(commentId: string, recipeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Devi effettuare l'accesso." };
  }

  const { data: recipe } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", recipeId)
    .single();

  const isRecipeOwner = recipe?.user_id === user.id;

  const { data: comment } = await supabase
    .from("recipe_comments")
    .select("user_id, created_at")
    .eq("id", commentId)
    .single();

  if (!comment) {
    return { error: "Commento non trovato." };
  }

  const isCommentOwner = comment.user_id === user.id;
  if (!isRecipeOwner && !isCommentOwner) {
    return { error: "Non puoi eliminare questo commento." };
  }
  if (isCommentOwner && !isRecipeOwner && !withinEditWindow(comment.created_at)) {
    return { error: "Il tempo per eliminare questo commento è scaduto (30 minuti)." };
  }

  const { error } = await supabase
    .from("recipe_comments")
    .delete()
    .eq("id", commentId);

  if (error) return { error: error.message };

  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}
