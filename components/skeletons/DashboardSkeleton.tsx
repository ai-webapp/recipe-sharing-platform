import { Skeleton } from "@/components/ui/Skeleton";

function RecipeCardSkeleton() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <Skeleton className="h-6 w-3/4" />
      <div className="mt-2 flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-14" />
      </div>
      <Skeleton className="mt-2 h-3 w-24" />
    </div>
  );
}

/**
 * Skeleton per la pagina Dashboard (titolo, filtri, sezioni ricette).
 */
export default function DashboardSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-5 w-56" />

      <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50/80 p-4">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-10 w-32" />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <RecipeCardSkeleton />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <Skeleton className="mb-4 h-6 w-40" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <RecipeCardSkeleton />
            </li>
          ))}
        </ul>
      </section>

      <Skeleton className="mt-8 h-4 w-36" />
    </div>
  );
}
