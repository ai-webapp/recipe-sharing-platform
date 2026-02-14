# Setup database Supabase

## Come eseguire la migration

1. Vai sulla [Dashboard Supabase](https://supabase.com/dashboard) e apri il tuo progetto.
2. Nel menu a sinistra: **SQL Editor**.
3. Clicca **New query**.
4. Copia e incolla tutto il contenuto del file `migrations/001_create_profiles_and_recipes.sql`.
5. Clicca **Run** (o premi Ctrl+Enter).

Se tutto va a buon fine, vedrai le tabelle **profiles** e **recipes** in **Table Editor**, con RLS e trigger attivi.

## Cosa crea lo script

| Elemento | Descrizione |
|----------|-------------|
| **profiles** | Tabella profili: `id` (collegato a `auth.users`), `user_name`, `full_name`, `created_at`, `updated_at`. |
| **recipes** | Tabella ricette: `id`, `created_at`, `user_id`, `title`, `ingredients`, `instructions`, `cooking_time`, `difficulty`, `category`. |
| **Trigger** | Alla registrazione di un utente viene creato automaticamente un profilo. `updated_at` su profiles si aggiorna a ogni UPDATE. |
| **RLS** | Profili: lettura per tutti, modifica solo del proprio. Ricette: lettura per tutti, insert/update/delete solo per l’autore. |

## Campo about_me in profiles

Per aggiungere il campo **about_me** (presentazione alla community) alla tabella `profiles`:

1. **SQL Editor** → **New query**.
2. Copia e incolla il contenuto di **`migrations/003_profiles_about_me.sql`**.
3. **Run**.

Poi riesegui lo script **`trigger_profiles_on_register.sql`** (per includere `about_me` nel trigger di registrazione).

## Trigger: profilo alla registrazione

Per creare **subito** una riga in `profiles` quando un utente si registra (prima ancora che apra "Profilo" o clicchi "Salva profilo"):

1. **SQL Editor** → **New query**.
2. Copia e incolla tutto il contenuto di **`trigger_profiles_on_register.sql`**.
3. **Run**.

Dopo averlo eseguito:
- **Alla registrazione** → il trigger crea la riga in `profiles` con `id`, `full_name` e `user_name` (presi dal form di registrazione).
- **Salva profilo** (pagina Profilo) → continua a fare **UPDATE** su quella riga (nome e username).

Se il trigger non è attivo, l’app crea comunque la riga al primo salvataggio da "Profilo" o con un upsert dopo la registrazione.

## Note

- **cooking_time**: intero, tempo in **minuti** (es. 30).
- **difficulty**: testo libero, es. `easy`, `medium`, `hard`.
- **category**: testo libero per ora (es. "Primi", "Dolci"). In seguito si potrà sostituire con una tabella categorie.
