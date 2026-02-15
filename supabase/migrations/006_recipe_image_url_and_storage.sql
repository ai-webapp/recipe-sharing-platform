-- Colonna per l'immagine della ricetta (URL pubblico da Storage)
ALTER TABLE public.recipes
ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.recipes.image_url IS 'URL pubblico dell''immagine (Supabase Storage o esterno)';

-- Bucket Storage per le immagini delle ricette (esegui nel SQL Editor se il bucket non esiste)
-- In alternativa crea il bucket da Dashboard: Storage → New bucket → "recipe-images", Public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-images',
  'recipe-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Chiunque può vedere le immagini (bucket pubblico)
CREATE POLICY "recipe-images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

-- Solo utenti autenticati possono caricare (solo le proprie cartelle recipe_id)
CREATE POLICY "recipe-images authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe-images');

-- L'autore può aggiornare/eliminare i propri file (path: recipe_id/xxx)
CREATE POLICY "recipe-images authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'recipe-images');

CREATE POLICY "recipe-images authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'recipe-images');
