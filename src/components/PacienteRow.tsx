import Link from "next/link";

import { formatarCpf } from "@/lib/cpf";
import type { Paciente } from "@/lib/pacientes";
import { formatarTelefone } from "@/lib/telefone";

import { Excluir } from "./excluir";
import { Listagem } from "./Listagem";

function formatarData(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

type Props = {
  paciente: Paciente;
};

export function PacienteRow({ paciente: p }: Props) {
  return (
    <tr className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80">
      <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
        <Listagem nome={p.nome_social} />
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{p.pronome ?? "—"}</td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 tabular-nums">
        {p.cpf ? formatarCpf(p.cpf) : "—"}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {formatarData(p.data_nascimento)}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 tabular-nums">
        {p.telefone ? formatarTelefone(p.telefone) : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link
            href={`/pacientes/${p.id}/editar`}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Editar
          </Link>
          <Excluir id={p.id} nome={p.nome_social} />
        </div>
      </td>
    </tr>
  );
}
