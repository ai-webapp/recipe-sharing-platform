import AddCommentForm from "@/components/AddCommentForm";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import LikeButton from "@/components/LikeButton";
import RecipeCommentList from "@/components/RecipeCommentList";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Facile",
  medium: "Medio",
  hard: "Difficile",
};

const CATEGORY_LABELS: Record<string, string> = {
  antipasti: "Antipasti",
  primi: "Primi",
  secondi: "Secondi",
  contorni: "Contorni",
  dolci: "Dolci",
  bevande: "Bevande",
  altro: "Altro",
};

function labelDifficulty(value: string | null): string | null {
  if (!value) return null;
  return DIFFICULTY_LABELS[value.toLowerCase()] ?? value;
}

function labelCategory(value: string | string[] | null): string | null {
  if (!value) return null;
  const raw = Array.isArray(value) ? value[0] : value;
  return CATEGORY_LABELS[raw?.toLowerCase() ?? ""] ?? raw ?? null;
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("id, title, ingredients, instructions, cooking_time, difficulty, category, created_at, user_id")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  let authorName: string | null = null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, user_name")
    .eq("id", recipe.user_id)
    .single();
  if (profile) {
    authorName = profile.full_name || profile.user_name || null;
  }

  const categoryLabel = labelCategory(recipe.category);
  const difficultyLabel = labelDifficulty(recipe.difficulty);

  const isOwner = user?.id === recipe.user_id;

  const { count: likeCount } = await supabase
    .from("recipe_likes")
    .select("id", { count: "exact", head: true })
    .eq("recipe_id", id);

  let userLike: { id: string } | null = null;
  if (user?.id) {
    const res = await supabase
      .from("recipe_likes")
      .select("id")
      .eq("recipe_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    userLike = res.data;
  }

  const { data: commentsRows } = await supabase
    .from("recipe_comments")
    .select("id, content, created_at, user_id")
    .eq("recipe_id", id)
    .order("created_at", { ascending: true });

  const commentUserIds = [...new Set((commentsRows ?? []).map((c) => c.user_id))];
  let commentProfileMap = new Map<string, string>();
  if (commentUserIds.length > 0) {
    const { data: commentProfiles } = await supabase
      .from("profiles")
      .select("id, full_name, user_name")
      .in("id", commentUserIds);
    commentProfileMap = new Map(
      (commentProfiles ?? []).map((p) => [
        p.id,
        p.full_name || p.user_name || "Utente",
      ])
    );
  }

  const comments = (commentsRows ?? []).map((c) => ({
    id: c.id,
    content: c.content,
    created_at: c.created_at,
    author_name: commentProfileMap.get(c.user_id) ?? null,
    user_id: c.user_id,
  }));

  return (
    <article>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="text-sm text-stone-600 hover:text-stone-800"
        >
          ← Torna alla dashboard
        </Link>
        {isOwner && (
          <>
            <Link
              href={`/recipes/${id}/edit`}
              className="text-sm font-medium text-stone-600 underline hover:text-stone-800"
            >
              Modifica
            </Link>
            <DeleteRecipeButton recipeId={id} />
          </>
        )}
      </div>
      <h1 className="text-2xl font-semibold text-stone-800">{recipe.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
        {authorName && <span>di {authorName}</span>}
        <span>{formatDate(recipe.created_at)}</span>
        {categoryLabel && (
          <span className="rounded bg-sky-100 px-2 py-0.5 text-sky-800">
            {categoryLabel}
          </span>
        )}
        {recipe.cooking_time != null && (
          <span>{recipe.cooking_time} min</span>
        )}
        {difficultyLabel && (
          <span>{difficultyLabel}</span>
        )}
        {!isOwner && (
          <LikeButton
            recipeId={id}
            initialCount={likeCount ?? 0}
            initialLiked={!!userLike}
            userId={user?.id ?? null}
          />
        )}
      </div>
      <section className="mt-6">
        <h2 className="text-lg font-medium text-stone-800">Ingredienti</h2>
        <p className="mt-2 whitespace-pre-line text-stone-700">
          {recipe.ingredients}
        </p>
      </section>
      <section className="mt-6">
        <h2 className="text-lg font-medium text-stone-800">Procedura</h2>
        <p className="mt-2 whitespace-pre-line text-stone-700">
          {recipe.instructions}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-stone-800">Commenti</h2>
        <div className="mt-4 space-y-4">
          {!isOwner && (
            <AddCommentForm key={id} recipeId={id} userId={user?.id ?? null} />
          )}
          <RecipeCommentList
            comments={comments}
            recipeId={id}
            currentUserId={user?.id ?? null}
            isRecipeOwner={isOwner}
          />
        </div>
      </section>
    </article>
  );
}
