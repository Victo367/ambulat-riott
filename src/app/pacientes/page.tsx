import Link from "next/link";

import { PacienteRow } from "@/components/PacienteRow";
import { listarPacientes } from "@/lib/pacientes";

export default async function PacientesPage() {
  const pacientes = await listarPacientes();

  return (
    <div className="flex flex-col gap-6">
      {pacientes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 px-6 py-10 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-400">
          Nenhum paciente cadastrado.{" "}
          <Link
            href="/pacientes/novo"
            className="font-medium text-zinc-900 underline underline-offset-2 dark:text-zinc-100"
          >
            Cadastrar o primeiro
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Pronome</th>
                <th className="px-4 py-3 font-medium">CPF</th>
                <th className="px-4 py-3 font-medium">Nascimento</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <PacienteRow key={p.id} paciente={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
