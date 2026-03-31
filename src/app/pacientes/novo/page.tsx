import { PacienteForm } from "@/components/PacienteForm";

import { criarPaciente } from "../actions";

type Props = {
  searchParams: Promise<{ erro?: string }>;
};

export default async function NovoPacientePage({ searchParams }: Props) {
  const { erro } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Novo paciente</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Preencha os dados abaixo. Campos com * são obrigatórios.
        </p>
      </div>

      <PacienteForm
        action={criarPaciente}
        submitLabel="Cadastrar"
        erro={erro ?? null}
      />
    </div>
  );
}
