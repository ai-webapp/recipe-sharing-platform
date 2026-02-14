-- Permette al proprietario della ricetta di eliminare qualsiasi commento sulla propria ricetta
CREATE POLICY "Proprietario ricetta può eliminare commenti"
  ON public.recipe_comments FOR DELETE
  USING (
    auth.uid() = (SELECT user_id FROM public.recipes WHERE id = recipe_id)
  );
