import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  titulo: string;
  descricao: ReactNode;
};

export function CabecalhoFormularioPaciente({ titulo, descricao }: Props) {
  return (
    <div>
      <Link
        href="/pacientes"
        className="text-sm font-medium text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
      >
        ← Voltar à listagem
      </Link>
      <h2 className="mt-4 text-xl font-semibold">{titulo}</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{descricao}</p>
    </div>
  );
}
