import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton generico per pagine con titolo, sottotitolo e area contenuto.
 */
export default function PageSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-5 w-72" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
