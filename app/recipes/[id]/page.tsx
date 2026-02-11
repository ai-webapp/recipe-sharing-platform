import Link from "next/link";
import Image from "next/image";
import { mockRecipes } from "@/lib/mock-recipes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = mockRecipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div>
        <p className="text-stone-600">Ricetta non trovata.</p>
        <Link href="/" className="mt-4 inline-block text-stone-600 underline hover:text-stone-800">
          Torna alle ricette
        </Link>
      </div>
    );
  }

  return (
    <article>
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-stone-600 hover:text-stone-800"
      >
        ← Tutte le ricette
      </Link>
      <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-stone-100">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="h-16 w-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-semibold text-stone-800">{recipe.title}</h1>
      <p className="mt-2 text-sm text-stone-500">
        di {recipe.author} · {formatDate(recipe.created_at)}
      </p>
      <p className="mt-4 text-stone-700">{recipe.description}</p>
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
    </article>
  );
}
