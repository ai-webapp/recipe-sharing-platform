import CommentItem from "./CommentItem";

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_name: string | null;
  user_id: string;
};

type Props = {
  comments: Comment[];
  recipeId: string;
  currentUserId: string | null;
  isRecipeOwner: boolean;
};

export default function RecipeCommentList({ comments, recipeId, currentUserId, isRecipeOwner }: Props) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-stone-500">
        Nessun commento ancora.{!isRecipeOwner && " Scrivi il primo!"}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          recipeId={recipeId}
          currentUserId={currentUserId}
          isRecipeOwner={isRecipeOwner}
        />
      ))}
    </ul>
  );
}
