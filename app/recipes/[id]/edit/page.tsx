import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import EditRecipeForm from "@/components/EditRecipeForm";
import { normalizeCategory } from "@/lib/recipe-categories";
import { createClient } from "@/lib/supabase/server";
import { parseImageUrls } from "@/lib/recipe-images";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("id, title, ingredients, instructions, cooking_time, difficulty, category, user_id, image_url")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  if (recipe.user_id !== user.id) {
    notFound();
  }

  const categoryValue = normalizeCategory(recipe.category);
  const recipeForEdit = {
    id: recipe.id,
    title: recipe.title,
    ingredients: recipe.ingredients ?? "",
    instructions: recipe.instructions ?? "",
    cooking_time: recipe.cooking_time ?? null,
    difficulty: recipe.difficulty ?? null,
    category: categoryValue,
    image_urls: parseImageUrls(recipe.image_url),
  };

  return (
    <div>
      <Link
        href={`/recipes/${id}`}
        className="mb-6 inline-block text-sm text-stone-600 hover:text-stone-800"
      >
        ← Torna al dettaglio
      </Link>
      <h1 className="text-2xl font-semibold text-stone-800">Modifica ricetta</h1>
      <p className="mt-2 text-stone-600">
        Modifica i campi e salva per aggiornare la ricetta.
      </p>
      <div className="mt-8">
        <EditRecipeForm recipe={recipeForEdit} />
      </div>
      <div className="mt-10 border-t border-stone-200 pt-8">
        <p className="mb-2 text-sm text-stone-600">
          Vuoi rimuovere definitivamente questa ricetta?
        </p>
        <DeleteRecipeButton recipeId={id} variant="button">
          Elimina ricetta
        </DeleteRecipeButton>
      </div>
    </div>
  );
}
