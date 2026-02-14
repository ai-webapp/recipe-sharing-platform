import Link from "next/link";

type DashboardRecipe = {
  id: string;
  title: string;
  created_at: string;
  category: string[] | null;
  difficulty: string | null;
  cooking_time: number | null;
  author_name: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  recipe: DashboardRecipe;
  showEditLink?: boolean;
  showMineLabel?: boolean;
};

export default function DashboardRecipeCard({ recipe, showEditLink, showMineLabel }: Props) {
  const cardContent = (
    <>
      <h2 className="text-lg font-semibold text-stone-800">{recipe.title}</h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-600">
        {recipe.author_name && <span>{recipe.author_name}</span>}
        {recipe.category && recipe.category.length > 0 && (
          <>
            {recipe.category.map((cat) => (
              <span
                key={cat}
                className="rounded bg-stone-100 px-2 py-0.5 text-stone-600 capitalize"
              >
                {cat}
              </span>
            ))}
          </>
        )}
        {recipe.cooking_time != null && (
          <span>{recipe.cooking_time} min</span>
        )}
        {recipe.difficulty && (
          <span className="capitalize">{recipe.difficulty}</span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-stone-500">
        {showMineLabel ? (
          <span className="rounded bg-green-200 px-2 py-0.5 font-medium text-stone-800">Mia ricetta</span>
        ) : (
          <span />
        )}
        <span>{formatDate(recipe.created_at)}</span>
      </div>
    </>
  );

  const className = "block rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md";

  if (showEditLink) {
    return (
      <div className={`relative ${className}`}>
        <Link href={`/recipes/${recipe.id}`} className="block">
          {cardContent}
        </Link>
        <Link
          href={`/recipes/${recipe.id}/edit`}
          className="mt-3 inline-block text-sm font-medium text-stone-600 underline hover:text-stone-800"
        >
          Modifica
        </Link>
      </div>
    );
  }

  return (
    <Link href={`/recipes/${recipe.id}`} className={className}>
      {cardContent}
    </Link>
  );
}
