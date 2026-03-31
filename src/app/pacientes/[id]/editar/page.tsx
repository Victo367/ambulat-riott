import { notFound } from "next/navigation";

import { CabecalhoFormularioPaciente } from "@/components/CabecalhoFormularioPaciente";
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
      <CabecalhoFormularioPaciente
        titulo="Editar paciente"
        descricao={
          <>
            Atualize os dados de <strong>{nomeExibicao(paciente)}</strong>.
          </>
        }
      />

      <PacienteForm
        action={salvarPaciente}
        paciente={paciente}
        submitLabel="Salvar alterações"
        erro={erro ?? null}
      />
    </div>
  );
}
