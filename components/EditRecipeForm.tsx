"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORY_OPTIONS, categoryForSupabase, normalizeCategory } from "@/lib/recipe-categories";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "— Seleziona —" },
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Medio" },
  { value: "hard", label: "Difficile" },
];

export type RecipeForEdit = {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  cooking_time: number | null;
  difficulty: string | null;
  category: string | null;
};

function ingredientRowsFromText(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [""];
  return trimmed.split(/\r?\n/).map((s) => s.trim());
}

export default function EditRecipeForm({ recipe }: { recipe: RecipeForEdit }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [ingredientRows, setIngredientRows] = useState<string[]>(
    ingredientRowsFromText(recipe.ingredients)
  );
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [cookingTime, setCookingTime] = useState(
    recipe.cooking_time != null ? String(recipe.cooking_time) : ""
  );
  const [difficulty, setDifficulty] = useState(recipe.difficulty ?? "");
  const [category, setCategory] = useState(
    normalizeCategory(recipe.category) ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function setIngredientAt(index: number, value: string) {
    setIngredientRows((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function addIngredientRow() {
    setIngredientRows((prev) => [...prev, ""]);
  }

  function removeIngredientRow(index: number) {
    setIngredientRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ingredientsText = ingredientRows
      .map((s) => s.trim())
      .filter(Boolean)
      .join("\n");
    if (!ingredientsText) {
      setError("Inserisci almeno un ingrediente.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("recipes")
      .update({
        title: title.trim(),
        ingredients: ingredientsText,
        instructions: instructions.trim(),
        cooking_time: cookingTime.trim() ? parseInt(cookingTime.trim(), 10) : null,
        difficulty: difficulty.trim() || null,
        category: categoryForSupabase(category),
      })
      .eq("id", recipe.id);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (!mounted) {
    return (
      <div className="max-w-xl animate-pulse rounded-lg border border-stone-200 bg-stone-50 p-8">
        <div className="h-10 w-3/4 rounded bg-stone-200" />
        <div className="mt-6 h-32 rounded bg-stone-200" />
        <div className="mt-4 h-24 rounded bg-stone-200" />
        <p className="mt-6 text-sm text-stone-500">Caricamento modulo…</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Titolo <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Es. Pasta al pomodoro"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Ingredienti <span className="text-red-600">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {ingredientRows.map((value, index) => (
              <div
                key={index}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setIngredientAt(index, e.target.value)}
                  placeholder="Es. 2 uova, 100g farina..."
                  className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
                <button
                  type="button"
                  onClick={() => removeIngredientRow(index)}
                  className="shrink-0 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Rimuovi
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredientRow}
              className="self-start rounded-lg border border-dashed border-stone-400 px-3 py-2 text-sm text-stone-600 hover:border-stone-500 hover:bg-stone-50"
            >
              + Aggiungi ingrediente
            </button>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Una riga per ogni ingrediente (con quantità se serve).
          </p>
        </div>
        <div>
          <label
            htmlFor="instructions"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Procedura <span className="text-red-600">*</span>
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            rows={6}
            placeholder="Descrivi i passaggi per preparare la ricetta"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="cooking_time"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Tempo (minuti)
            </label>
            <input
              id="cooking_time"
              type="number"
              min={1}
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              placeholder="30"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>
          <div>
            <label
              htmlFor="difficulty"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Difficoltà
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              <option value="">— Seleziona —</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-stone-800 px-4 py-2 font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {loading ? "Salvataggio…" : "Salva modifiche"}
          </button>
          <Link
            href={`/recipes/${recipe.id}`}
            className="rounded-lg border border-stone-300 px-4 py-2 text-stone-700 hover:bg-stone-100"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
