-- ============================================
-- TRIGGER: crea riga in profiles alla REGISTRAZIONE
-- Esegui questo script nel SQL Editor di Supabase (una sola volta).
-- Dopo: ogni nuovo utente avrà subito una riga in public.profiles.
-- "Salva profilo" continuerà a fare UPDATE su quella riga.
-- ============================================

-- 1. Funzione: inserisce in profiles (id, full_name, user_name, about_me) da auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_name, about_me)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'about_me'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger: dopo ogni INSERT su auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
