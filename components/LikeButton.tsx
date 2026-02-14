"use client";

import { toggleLike } from "@/app/actions/likes";
import { useOptimistic, useTransition } from "react";

type Props = {
  recipeId: string;
  initialCount: number;
  initialLiked: boolean;
  userId: string | null;
};

export default function LikeButton({
  recipeId,
  initialCount,
  initialLiked,
  userId,
}: Props) {
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(initialLiked);
  const [optimisticCount, setOptimisticCount] = useOptimistic(initialCount);
  const [isPending, startTransition] = useTransition();

  const isLiked = optimisticLiked;
  const count = optimisticCount;
  const canLike = !!userId;

  function handleClick() {
    if (!canLike || isPending) return;
    startTransition(async () => {
      setOptimisticLiked(!isLiked);
      setOptimisticCount(isLiked ? count - 1 : count + 1);
      const result = await toggleLike(recipeId);
      if (result.error) {
        setOptimisticLiked(isLiked);
        setOptimisticCount(count);
        alert(result.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canLike || isPending}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
        isLiked
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      }`}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Togli mi piace" : "Mi piace"}
    >
      <HeartIcon filled={isLiked} />
      <span>{count}</span>
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
