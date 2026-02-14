import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-stone-600 hover:text-stone-800"
      >
        ← Home
      </Link>
      <h1 className="text-2xl font-semibold text-stone-800">Registrati</h1>
      <p className="mt-2 text-stone-600">
        Crea un account per salvare e condividere le tue ricette.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
