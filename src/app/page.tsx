import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ambulatório T T
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Acesse o cadastro de pacientes para listar, adicionar, editar ou excluir os pacientes.
          </p>
        </div>
        <Link
          href="/pacientes"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-5 text-base font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Acessar cadastro de pacientes
        </Link>
      </main>
    </div>
  );
}
