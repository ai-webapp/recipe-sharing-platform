-- Fino a 3 immagini per ricetta (array di URL)
ALTER TABLE public.recipes
ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

COMMENT ON COLUMN public.recipes.image_urls IS 'Fino a 3 URL delle immagini (Supabase Storage)';

-- Copia la singola image_url esistente nel nuovo array (se presente)
UPDATE public.recipes
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_url != '';

-- Rimuovi la colonna singola
ALTER TABLE public.recipes DROP COLUMN IF EXISTS image_url;
