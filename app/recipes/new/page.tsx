import NewRecipeForm from "@/components/NewRecipeForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewRecipePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-6 inline-block text-sm text-stone-600 hover:text-stone-800"
      >
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-semibold text-stone-800">Carica ricetta</h1>
      <p className="mt-2 text-stone-600">
        Compila i campi per aggiungere una nuova ricetta. Titolo, ingredienti e
        procedura sono obbligatori.
      </p>
      <div className="mt-8">
        <NewRecipeForm userId={user.id} />
      </div>
    </div>
  );
}
