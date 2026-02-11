import RecipeCard from "@/components/RecipeCard";
import { mockRecipes } from "@/lib/mock-recipes";

export default function Home() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-stone-800">
        Tutte le ricette
      </h1>
      <p className="mb-8 text-stone-600">
        Sfoglia le ricette condivise dalla community.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockRecipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
    </div>
  );
}
