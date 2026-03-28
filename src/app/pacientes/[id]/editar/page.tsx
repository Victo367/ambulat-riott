import Link from "next/link";
import { notFound } from "next/navigation";

import { PacienteForm } from "@/components/PacienteForm";
import { nomeExibicao, obterPaciente } from "@/lib/pacientes";

import { salvarPaciente } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
};

export default async function EditarPacientePage({ params, searchParams }: Props) {
  const { id: idStr } = await params;
  const { erro } = await searchParams;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const paciente = await obterPaciente(id);
  if (!paciente) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/pacientes"
          className="text-sm font-medium text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
        >
          ← Voltar à listagem
        </Link>
        <h2 className="mt-4 text-xl font-semibold">Editar paciente</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Atualize os dados de <strong>{nomeExibicao(paciente)}</strong>.
        </p>
      </div>

      <PacienteForm
        action={salvarPaciente}
        paciente={paciente}
        submitLabel="Salvar alterações"
        erro={erro ?? null}
      />
    </div>
  );
}
