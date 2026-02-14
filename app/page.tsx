import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-2 text-2xl font-semibold text-stone-800">
        Condividi le tue ricette
      </h1>
      <p className="mb-8 text-stone-600">
        Accedi per creare e condividere le tue ricette con la community.
      </p>

      <Link
        href="/login"
        className="block w-full rounded-lg bg-stone-800 px-4 py-3 text-center font-medium text-white hover:bg-stone-700"
      >
        Inizia a creare le ricette
      </Link>
    </div>
  );
}
