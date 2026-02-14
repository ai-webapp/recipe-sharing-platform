import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton per pagina dettaglio ricetta e pagina modifica ricetta.
 */
export default function RecipeDetailSkeleton() {
  return (
    <div>
      <Skeleton className="mb-6 h-4 w-40" />

      <Skeleton className="h-8 max-w-md w-3/4" />
      <div className="mt-2 flex flex-wrap gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>

      <section className="mt-6">
        <Skeleton className="h-6 w-28" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </section>

      <section className="mt-6">
        <Skeleton className="h-6 w-24" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </section>
    </div>
  );
}
