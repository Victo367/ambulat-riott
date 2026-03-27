import Link from "next/link";
import type { ReactNode } from "react";

/** Evita pré-render no build e acessa o MySQL só em tempo de requisição. */
export const dynamic = "force-dynamic";

export default function PacientesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Cadastro de pacientes do ambulatório
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm">
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
      </header>
      {children}
    </div>
  );
}
