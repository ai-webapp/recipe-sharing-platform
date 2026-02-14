"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CONFIRM_MESSAGE =
  "Sei sicuro di voler eliminare questa ricetta? L'operazione non si può annullare.";

type Props = {
  recipeId: string;
  variant?: "link" | "button";
  className?: string;
  children?: React.ReactNode;
};

export default function DeleteRecipeButton({
  recipeId,
  variant = "link",
  className,
  children,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm(CONFIRM_MESSAGE)) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("recipes").delete().eq("id", recipeId);
    setLoading(false);
    if (error) {
      alert(`Errore durante l'eliminazione: ${error.message}`);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const label = children ?? "Elimina";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={
          className ??
          "rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
        }
      >
        {loading ? "Eliminazione…" : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        className ??
        "text-sm font-medium text-red-600 underline hover:text-red-800 disabled:opacity-50"
      }
    >
      {loading ? "Eliminazione…" : label}
    </button>
  );
}
