import DashboardRecipeCard from "@/components/DashboardRecipeCard";
import { createClient } from "@/lib/supabase/server";
import { parseImageUrls } from "@/lib/recipe-images";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PreferitePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: likes } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const recipeIds = (likes ?? []).map((l) => l.recipe_id).filter(Boolean);
  if (recipeIds.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Ricette preferite</h1>
        <p className="mt-2 text-stone-600">
          Qui vedi le ricette a cui hai messo &quot;Mi piace&quot;.
        </p>
        <p className="mt-8 rounded-lg border border-stone-200 bg-stone-50 px-4 py-6 text-center text-stone-600">
          Non hai ancora messo &quot;Mi piace&quot; a nessuna ricetta. Vai alla{" "}
          <Link href="/dashboard" className="font-medium text-stone-800 underline hover:text-stone-600">
            Dashboard
          </Link>{" "}
          e metti &quot;Mi piace&quot; alle ricette che ti interessano.
        </p>
        <p className="mt-6">
          <Link href="/dashboard" className="text-stone-600 underline hover:text-stone-800">
            ← Torna alla Dashboard
          </Link>
        </p>
      </div>
    );
  }

  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, title, created_at, cooking_time, difficulty, category, user_id, image_url")
    .in("id", recipeIds);

  const orderByLike = (recipes ?? []).slice().sort((a, b) => {
    const iA = recipeIds.indexOf(a.id);
    const iB = recipeIds.indexOf(b.id);
    return iA - iB;
  });

  const authorIds = [...new Set(orderByLike.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, user_name")
    .in("id", authorIds);
  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p.full_name || p.user_name || "Utente"])
  );

  const recipesWithAuthor = orderByLike.map((r) => ({
    id: r.id,
    title: r.title,
    created_at: r.created_at,
    category: Array.isArray(r.category) ? r.category : r.category ? [r.category] : null,
    difficulty: r.difficulty ?? null,
    cooking_time: r.cooking_time ?? null,
    author_name: profileMap.get(r.user_id) ?? null,
    image_urls: parseImageUrls(r.image_url),
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Ricette preferite</h1>
      <p className="mt-2 text-stone-600">
        Le ricette a cui hai messo &quot;Mi piace&quot;.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipesWithAuthor.map((recipe) => (
          <li key={recipe.id}>
            <DashboardRecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <Link href="/dashboard" className="text-stone-600 underline hover:text-stone-800">
          ← Torna alla Dashboard
        </Link>
      </p>
    </div>
  );
}
