"use client";

import { CATEGORY_OPTIONS } from "@/lib/recipe-categories";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "Tutte le difficoltà" },
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Medio" },
  { value: "hard", label: "Difficile" },
];

export default function DashboardSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") ?? "");

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setCategory(searchParams.get("category") ?? "");
    setDifficulty(searchParams.get("difficulty") ?? "");
  }, [searchParams]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);
    const query = params.toString();
    router.push(query ? `/dashboard?${query}` : "/dashboard");
  }, [router, q, category, difficulty]);

  const clearFilters = useCallback(() => {
    setQ("");
    setCategory("");
    setDifficulty("");
    router.push("/dashboard");
  }, [router]);

  const hasActiveFilters =
    (searchParams.get("q") ?? "").trim() !== "" ||
    (searchParams.get("category") ?? "") !== "" ||
    (searchParams.get("difficulty") ?? "") !== "";

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="search-q" className="mb-1 block text-xs font-medium text-stone-500">
              Ricerca libera
            </label>
            <input
              id="search-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyFilters())}
              placeholder="Titolo, ingredienti, procedura..."
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              aria-label="Cerca nelle ricette"
            />
          </div>
          <div>
            <label htmlFor="filter-category" className="mb-1 block text-xs font-medium text-stone-500">
              Categoria
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              aria-label="Filtra per categoria"
            >
              <option value="">Tutte</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-difficulty" className="mb-1 block text-xs font-medium text-stone-500">
              Difficoltà
            </label>
            <select
              id="filter-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              aria-label="Filtra per difficoltà"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            Cerca
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
            >
              Cancella filtri
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
