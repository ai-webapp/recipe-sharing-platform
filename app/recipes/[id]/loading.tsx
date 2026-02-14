import RecipeDetailSkeleton from "@/components/skeletons/RecipeDetailSkeleton";

/**
 * Stato di caricamento per /recipes/[id] (dettaglio) e /recipes/[id]/edit.
 */
export default function RecipeIdLoading() {
  return <RecipeDetailSkeleton />;
}
