-- ============================================
-- Mi piace e commenti (funzionalità social)
-- Esegui nel SQL Editor di Supabase
-- ============================================

-- ============================================
-- 1. Tabella RECIPE_LIKES (Mi piace)
-- Un utente può mettere "mi piace" a una ricetta (un solo like per ricetta).
-- ============================================
CREATE TABLE public.recipe_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe_id ON public.recipe_likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_user_id ON public.recipe_likes(user_id);

COMMENT ON TABLE public.recipe_likes IS 'Mi piace sulle ricette (un like per utente per ricetta)';

-- ============================================
-- 2. Tabella RECIPE_COMMENTS (Commenti)
-- ============================================
CREATE TABLE public.recipe_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recipe_comments_recipe_id ON public.recipe_comments(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_comments_created_at ON public.recipe_comments(recipe_id, created_at ASC);

COMMENT ON TABLE public.recipe_comments IS 'Commenti sulle ricette';

-- Trigger updated_at per i commenti
CREATE TRIGGER recipe_comments_updated_at
  BEFORE UPDATE ON public.recipe_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- 3. Row Level Security (RLS)
-- ============================================

ALTER TABLE public.recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_comments ENABLE ROW LEVEL SECURITY;

-- RECIPE_LIKES: tutti possono leggere, solo utenti autenticati possono inserire/eliminare il proprio like
CREATE POLICY "Chiunque può vedere i like"
  ON public.recipe_likes FOR SELECT
  USING (true);

CREATE POLICY "Utente può mettere like"
  ON public.recipe_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utente può togliere il proprio like"
  ON public.recipe_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RECIPE_COMMENTS: tutti possono leggere, solo l'autore può inserire/aggiornare/eliminare i propri commenti
CREATE POLICY "Chiunque può vedere i commenti"
  ON public.recipe_comments FOR SELECT
  USING (true);

CREATE POLICY "Utente autenticato può commentare"
  ON public.recipe_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utente può modificare il proprio commento"
  ON public.recipe_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utente può eliminare il proprio commento"
  ON public.recipe_comments FOR DELETE
  USING (auth.uid() = user_id);
