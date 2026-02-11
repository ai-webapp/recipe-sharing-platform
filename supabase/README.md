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

## Note

- **cooking_time**: intero, tempo in **minuti** (es. 30).
- **difficulty**: testo libero, es. `easy`, `medium`, `hard`.
- **category**: testo libero per ora (es. "Primi", "Dolci"). In seguito si potrà sostituire con una tabella categorie.
