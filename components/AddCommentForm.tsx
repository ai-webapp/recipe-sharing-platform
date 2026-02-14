"use client";

import { addComment } from "@/app/actions/comments";
import { useActionState, useEffect, useState } from "react";

type Props = {
  recipeId: string;
  userId: string | null;
};

type FormState = { error?: string; success?: boolean } | null;

export default function AddCommentForm({ recipeId, userId }: Props) {
  const [content, setContent] = useState("");
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_, formData: FormData) => {
      const rid = formData.get("recipeId") as string;
      const result = await addComment(rid, formData);
      return result.error ? { error: result.error } : { success: true };
    },
    null
  );

  useEffect(() => {
    if (state?.error) alert(state.error);
  }, [state?.error]);

  useEffect(() => {
    if (state?.success) setContent("");
  }, [state?.success]);

  if (!userId) {
    return (
      <p className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
        <a href="/login" className="font-medium text-stone-800 underline hover:no-underline">
          Accedi
        </a>{" "}
        per lasciare un commento.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="recipeId" value={recipeId} />
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Scrivi un commento..."
        rows={3}
        required
        maxLength={2000}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {isPending ? "Invio…" : "Invia commento"}
        </button>
        <span className="text-xs text-stone-500">
          {content.length}/2000
        </span>
      </div>
    </form>
  );
}
