-- ============================================
-- Setup database: profiles + recipes
-- Esegui questo script nel SQL Editor di Supabase
-- ============================================

-- Estensione UUID (di solito già attiva su Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Tabella PROFILES
-- Collegata a auth.users (un profilo per utente)
-- ============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indice per ricerche per user_name
CREATE INDEX IF NOT EXISTS idx_profiles_user_name ON public.profiles(user_name);

-- Commenti
COMMENT ON TABLE public.profiles IS 'Profilo utente collegato a Supabase Auth';
COMMENT ON COLUMN public.profiles.id IS 'Stesso id di auth.users';
COMMENT ON COLUMN public.profiles.user_name IS 'Nome utente visualizzato (es. @mariarossi)';
COMMENT ON COLUMN public.profiles.full_name IS 'Nome e cognome';

-- ============================================
-- 2. Tabella RECIPES
-- ============================================
CREATE TABLE public.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  ingredients text NOT NULL,
  instructions text NOT NULL,
  cooking_time integer,           -- minuti (es. 30)
  difficulty text,                -- es. 'easy', 'medium', 'hard'
  category text                  -- categoria libera per ora (es. 'Antipasti', 'Primi')
);

-- Indici utili
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON public.recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes(category);

-- Commenti
COMMENT ON TABLE public.recipes IS 'Ricette create dagli utenti';
COMMENT ON COLUMN public.recipes.cooking_time IS 'Tempo di cottura in minuti';
COMMENT ON COLUMN public.recipes.difficulty IS 'Difficoltà: easy, medium, hard';
COMMENT ON COLUMN public.recipes.category IS 'Categoria ricetta (testo libero per ora)';

-- ============================================
-- 3. Trigger: updated_at su PROFILES
-- ============================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- 4. Trigger: crea profilo quando si registra un utente
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. Row Level Security (RLS)
-- ============================================

-- Abilita RLS sulle tabelle
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- PROFILES: tutti possono leggere, solo il proprietario può aggiornare
CREATE POLICY "Profiles sono visibili a tutti"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Utente può aggiornare il proprio profilo"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Utente può inserire il proprio profilo (fallback)"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RECIPES: tutti possono leggere, solo l'autore può inserire/aggiornare/cancellare
CREATE POLICY "Ricette sono visibili a tutti"
  ON public.recipes FOR SELECT
  USING (true);

CREATE POLICY "Solo l'autore può inserire una ricetta"
  ON public.recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Solo l'autore può aggiornare la propria ricetta"
  ON public.recipes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Solo l'autore può eliminare la propria ricetta"
  ON public.recipes FOR DELETE
  USING (auth.uid() = user_id);
