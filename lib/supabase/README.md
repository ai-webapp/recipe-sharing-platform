# Setup Supabase nel progetto

## Cosa abbiamo configurato

### 1. Due tipi di client

| File | Uso |
|------|-----|
| **`lib/supabase/client.ts`** | Componenti **Client** (con `"use client"`): login, logout, form, lettura/scrittura dati dal browser. |
| **`lib/supabase/server.ts`** | **Server Components**, Server Actions, API routes: lettura/scrittura dati e sessione sul server. |

Next.js esegue codice in due contesti: **browser** (client) e **server**. Supabase deve usare cookie per la sessione; il client browser e il client server li gestiscono in modi diversi, quindi servono entrambi i file.

### 2. Middleware (`middleware.ts`)

- Esegue a **ogni richiesta** (tranne file statici).
- Chiama Supabase per **aggiornare la sessione** (refresh del token) e scrive i cookie nella response.
- **Non** reindirizza alla login: homepage e ricette restano pubbliche. La protezione delle route private si farà nelle singole pagine (es. dashboard).

### 3. Variabili d’ambiente

- **`.env.local`** (non in Git): qui metti URL e chiave del progetto Supabase.
- **`.env.local.example`**: esempio di quali variabili servono; puoi copiarlo in `.env.local` e compilare.

Valori da prendere in Supabase: **Dashboard → Project Settings → API**  
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`  
- **anon public** (o Publishable key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Schema tabelle (come da tua configurazione)

- **`profiles`**: `id` (uuid, = auth.users.id), `user_name`, `full_name`, `created_at`, `updated_at`
- **`recipes`**: `id`, `created_at`, `user_id`, `title`, `ingredients`, `instructions`, `cooking_time`, `difficulty`, `category`

---

## Come usare nel codice

**In un Server Component (es. `app/page.tsx`):**
```ts
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("recipes").select("*");
  // ...
}
```

**In un Client Component (es. form di login):**
```ts
"use client";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const supabase = createClient();
  // supabase.auth.signInWithPassword(...), ecc.
}
```

Dopo aver creato `.env.local` con URL e anon key, riavvia il dev server (`npm run dev`).
