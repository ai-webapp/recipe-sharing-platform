"use client";

import { deleteComment, updateComment } from "@/app/actions/comments";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EDIT_WINDOW_MS = 30 * 60 * 1000; // 30 minuti

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_name: string | null;
  user_id: string;
};

type Props = {
  comment: Comment;
  recipeId: string;
  currentUserId: string | null;
  isRecipeOwner: boolean;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return "0:00";
  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function CommentItem({ comment, recipeId, currentUserId, isRecipeOwner }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [pending, setPending] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const isCommentOwner = currentUserId === comment.user_id;
  const expiresAt = new Date(comment.created_at).getTime() + EDIT_WINDOW_MS;
  const withinEditWindow = now < expiresAt;
  const remainingMs = Math.max(0, expiresAt - now);

  // Solo chi ha scritto il commento è soggetto ai 30 minuti (e al countdown)
  const canEdit = isCommentOwner && !isRecipeOwner && withinEditWindow;
  const canDeleteAsCommentOwner = isCommentOwner && withinEditWindow;
  const canDeleteAsRecipeOwner = isRecipeOwner;
  const showDeleteButton = canDeleteAsRecipeOwner || canDeleteAsCommentOwner;
  const showCountdownAndEdit = isCommentOwner && !isRecipeOwner && withinEditWindow;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!showCountdownAndEdit) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [comment.created_at, showCountdownAndEdit]);

  async function handleDelete() {
    if (!confirm("Eliminare questo commento?")) return;
    setPending(true);
    const result = await deleteComment(comment.id, recipeId);
    setPending(false);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("content", editContent.trim());
    setPending(true);
    const result = await updateComment(comment.id, recipeId, formData);
    setPending(false);
    if (result.error) {
      alert(result.error);
    } else {
      setEditing(false);
      router.refresh();
    }
  }

  function handleCancel() {
    setEditContent(comment.content);
    setEditing(false);
  }

  return (
    <li className="rounded-lg border border-stone-200 bg-stone-50/50 px-4 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-stone-500">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-medium text-stone-700">
            {comment.author_name ?? "Utente"}
          </span>
          <span>{formatDate(comment.created_at)}</span>
        </div>
        {(showDeleteButton || showCountdownAndEdit) && !editing && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {showCountdownAndEdit && (
              <span className="text-xs text-stone-500" suppressHydrationWarning>
                Tempo rimanente per modifiche: <strong className="tabular-nums text-stone-600">{hasMounted ? formatCountdown(remainingMs) : "--:--"}</strong>
              </span>
            )}
            <div className="flex gap-2">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  disabled={pending}
                  className="text-stone-600 underline hover:text-stone-800 disabled:opacity-50"
                >
                  Modifica
                </button>
              )}
              {showDeleteButton && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={pending}
                  className="text-red-600 underline hover:text-red-800 disabled:opacity-50"
                >
                  Elimina
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {editing ? (
        <form onSubmit={handleSave} className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            required
            maxLength={2000}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-500">
              {editContent.length}/2000
            </span>
            <button
              type="submit"
              disabled={pending || !editContent.trim()}
              className="rounded-lg bg-stone-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
            >
              {pending ? "Salvataggio…" : "Salva"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={pending}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-50"
            >
              Annulla
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-1 whitespace-pre-wrap text-stone-800">{comment.content}</p>
      )}
    </li>
  );
}
