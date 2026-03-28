import Link from "next/link";

import { ExcluirPacienteButton } from "./ExcluirPacienteButton";
import { NomePacienteListagem } from "@/components/NomePacienteListagem";
import { listarPacientes, nomeExibicao } from "@/lib/pacientes";

function formatarData(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function labelSexo(s: string | null): string {
  if (s === "M") return "Masculino";
  if (s === "F") return "Feminino";
  if (s === "O") return "Outro";
  return "—";
}

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
                <th className="px-4 py-3 font-medium">Sexo</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                >
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {p.nome_social?.trim() ? (
                      <NomePacienteListagem
                        nomeSocial={p.nome_social.trim()}
                        nomeCivil={p.nome}
                      />
                    ) : (
                      <span className="font-medium">{p.nome}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {p.pronome ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {p.cpf ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {formatarData(p.data_nascimento)}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {labelSexo(p.sexo)}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {p.telefone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/pacientes/${p.id}/editar`}
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        Editar
                      </Link>
                      <ExcluirPacienteButton
                        id={p.id}
                        nome={nomeExibicao(p)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
