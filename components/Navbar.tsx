import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-semibold text-stone-800 hover:text-stone-600"
        >
          Ricette
        </Link>
        <div className="flex gap-6">
          <Link
            href="/login"
            className="text-stone-600 hover:text-stone-800"
          >
            Accedi
          </Link>
          <Link
            href="/register"
            className="text-stone-600 hover:text-stone-800"
          >
            Registrati
          </Link>
        </div>
      </nav>
    </header>
  );
}
