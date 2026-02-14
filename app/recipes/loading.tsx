import FormPageSkeleton from "@/components/skeletons/FormPageSkeleton";

/**
 * Stato di caricamento per /recipes/new (e altre route sotto /recipes senza [id]).
 */
export default function RecipesLoading() {
  return <FormPageSkeleton />;
}
