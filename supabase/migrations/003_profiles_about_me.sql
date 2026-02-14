-- Aggiunge il campo about_me alla tabella profiles.
-- Esegui nel SQL Editor di Supabase.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS about_me text;

COMMENT ON COLUMN public.profiles.about_me IS 'Presentazione dell''utente per la community (opzionale).';
