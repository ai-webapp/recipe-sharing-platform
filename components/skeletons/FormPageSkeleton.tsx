import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton per pagine con form (nuova ricetta, modifica, profilo, login, register).
 */
export default function FormPageSkeleton() {
  return (
    <div>
      <Skeleton className="mb-6 h-4 w-28" />
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-5 w-72" />

      <div className="mt-8 max-w-xl space-y-6">
        <div>
          <Skeleton className="mb-2 h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
