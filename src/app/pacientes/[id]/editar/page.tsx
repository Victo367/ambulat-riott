import { notFound } from "next/navigation";
import { PacienteForm } from "@/components/PacienteForm";
import { obterPaciente } from "@/lib/pacientes";
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
        <h2 className="text-xl font-semibold">Editar paciente</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Atualize os dados de <strong>{paciente.nome_social}</strong>.
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
