import Link from "next/link";

export function Sidenav() {
  return (
    <aside className="w-full shrink-0 border-b border-zinc-200 pb-4 dark:border-zinc-800 md:w-64 md:border-b-0 md:border-r md:pb-0 md:pr-4">
      <h1 className="text-xl font-semibold tracking-tight">Pacientes</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Cadastro de pacientes do ambulatório
      </p>
      <nav className="mt-4 flex flex-wrap gap-2 text-sm md:flex-col">
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 px-3 py-2 font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Início
        </Link>
        <Link
          href="/pacientes"
          className="rounded-lg border border-zinc-300 px-3 py-2 font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Listagem
        </Link>
        <Link
          href="/pacientes/novo"
          className="rounded-lg bg-zinc-900 px-3 py-2 font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Novo paciente
        </Link>
      </nav>
    </aside>
  );
}
