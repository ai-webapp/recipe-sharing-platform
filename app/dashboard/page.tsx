import DashboardRecipeCard from "@/components/DashboardRecipeCard";
import DashboardSearchFilters from "@/components/DashboardSearchFilters";
import { Skeleton } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { parseImageUrls } from "@/lib/recipe-images";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

function buildRecipeQuery(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filters: { q?: string; category?: string; difficulty?: string }
) {
  const select = "id, title, created_at, cooking_time, difficulty, category, user_id, image_url";
  let query = supabase.from("recipes").select(select);

  const q = filters.q?.trim();
  if (q) {
    const pattern = `%${q.replace(/'/g, "''")}%`;
    query = query.or(
      `title.ilike.${pattern},ingredients.ilike.${pattern},instructions.ilike.${pattern}`
    );
  }
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);

  return query.order("created_at", { ascending: false });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; difficulty?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const filters = {
    q: params.q,
    category: params.category,
    difficulty: params.difficulty,
  };

  const { data: allRecipes, error } = await buildRecipeQuery(supabase, filters);

  const authorIds = [...new Set((allRecipes ?? []).map((r) => r.user_id))];
  let profileMap = new Map<string, string>();
  if (authorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, user_name")
      .in("id", authorIds);
    profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p.full_name || p.user_name || "Utente"])
    );
  }

  const recipesWithAuthor = (allRecipes ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    created_at: r.created_at,
    category: Array.isArray(r.category) ? r.category : r.category ? [r.category] : null,
    difficulty: r.difficulty ?? null,
    cooking_time: r.cooking_time ?? null,
    author_name: profileMap.get(r.user_id) ?? null,
    user_id: r.user_id,
    image_urls: parseImageUrls(r.image_url),
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">
        Dashboard
      </h1>
      <p className="mt-2 text-stone-600">
        Ciao{user.email ? `, ${user.email}` : ""}.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Suspense fallback={<div className="h-10 w-64"><Skeleton className="h-full w-full rounded-lg" /></div>}>
          <DashboardSearchFilters />
        </Suspense>
        <Link
          href="/recipes/new"
          className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Carica ricette
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-stone-800">
          Le ricette della community
        </h2>
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Errore nel caricamento: {error.message}
          </p>
        ) : recipesWithAuthor.length === 0 ? (
          <p className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-6 text-center text-stone-600">
            Nessuna ricetta ancora. Clicca &quot;Carica ricette&quot; per aggiungerne una.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipesWithAuthor.map((recipe) => (
              <li key={recipe.id}>
                <DashboardRecipeCard
                  recipe={{
                    id: recipe.id,
                    title: recipe.title,
                    created_at: recipe.created_at,
                    category: recipe.category,
                    difficulty: recipe.difficulty,
                    cooking_time: recipe.cooking_time,
                    author_name: recipe.author_name,
                    image_urls: recipe.image_urls,
                  }}
                  showMineLabel={recipe.user_id === user.id}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-8">
        <Link href="/" className="text-stone-600 underline hover:text-stone-800">
          ← Torna alla home
        </Link>
      </p>
    </div>
  );
}
