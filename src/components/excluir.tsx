"use client";

import { removerPaciente } from "../app/pacientes/actions";

type Props = {
  id: string;
  nome: string;
};

export function Excluir({ id, nome }: Props) {
  return (
    <form action={removerPaciente}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-300 dark:hover:bg-red-950/40"
        onClick={(e) => {
          if (
            !confirm(
              `Excluir o paciente "${nome}"? Esta ação não pode ser desfeita.`,
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        Excluir
      </button>
    </form>
  );
}
