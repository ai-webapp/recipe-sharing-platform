import DashboardRecipeCard from "@/components/DashboardRecipeCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SavedRecipesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, title, created_at, cooking_time, difficulty, category, user_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, user_name")
    .eq("id", user.id)
    .single();

  const authorName = profile?.full_name || profile?.user_name || null;

  const recipesWithAuthor = (recipes ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    created_at: r.created_at,
    category: Array.isArray(r.category) ? r.category : r.category ? [r.category] : null,
    difficulty: r.difficulty ?? null,
    cooking_time: r.cooking_time ?? null,
    author_name: authorName,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Le mie ricette salvate</h1>
      <p className="mt-2 text-stone-600">
        Tutte le ricette che hai creato e salvato.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/recipes/new"
          className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Carica ricette
        </Link>
      </div>

      {recipesWithAuthor.length === 0 ? (
        <p className="mt-8 rounded-lg border border-stone-200 bg-stone-50 px-4 py-6 text-center text-stone-600">
          Non hai ancora salvato nessuna ricetta. Clicca &quot;Carica ricette&quot; per aggiungerne una.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipesWithAuthor.map((recipe) => (
            <li key={recipe.id}>
              <DashboardRecipeCard recipe={recipe} showEditLink />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8">
        <Link href="/dashboard" className="text-stone-600 underline hover:text-stone-800">
          ← Torna alla Dashboard
        </Link>
      </p>
    </div>
  );
}
