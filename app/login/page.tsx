import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-stone-600 hover:text-stone-800"
      >
        ← Home
      </Link>
      <h1 className="text-2xl font-semibold text-stone-800">Accedi</h1>
      <p className="mt-2 text-stone-600">
        Inserisci email e password per entrare nel tuo account.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-stone-500">Caricamento…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
