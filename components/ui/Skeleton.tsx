type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Blocco skeleton con animazione pulse. Usare come base per stati di caricamento.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-stone-200 ${className ?? ""}`.trim()}
      aria-hidden
      {...props}
    />
  );
}
