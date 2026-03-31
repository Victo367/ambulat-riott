import { CabecalhoFormularioPaciente } from "@/components/CabecalhoFormularioPaciente";
import { PacienteForm } from "@/components/PacienteForm";

import { criarPaciente } from "../actions";

type Props = {
  searchParams: Promise<{ erro?: string }>;
};

export default async function NovoPacientePage({ searchParams }: Props) {
  const { erro } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <CabecalhoFormularioPaciente
        titulo="Novo paciente"
        descricao="Preencha os dados abaixo. Campos com * são obrigatórios."
      />

      <PacienteForm
        action={criarPaciente}
        submitLabel="Cadastrar"
        erro={erro ?? null}
      />
    </div>
  );
}
