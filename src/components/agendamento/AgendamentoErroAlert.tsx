"use client";

import {
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type AgendamentoErroAlertProps = {
  titulo?: string;
  mensagem: string;
  variante?: "erro" | "conflito";
};

export default function AgendamentoErroAlert({
  titulo,
  mensagem,
  variante = "erro",
}: AgendamentoErroAlertProps) {
  const isConflito = variante === "conflito";

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-2xl text-sm animate-fade-in border ${
        isConflito
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-rose-50 border-rose-100 text-rose-700"
      }`}
    >
      {isConflito ? (
        <InformationCircleIcon className="w-6 h-6 shrink-0 text-amber-600 mt-0.5" />
      ) : (
        <ExclamationCircleIcon className="w-6 h-6 shrink-0 mt-0.5" />
      )}
      <div className="space-y-1 min-w-0">
        <p className="font-bold">
          {titulo ??
            (isConflito ? "Horário indisponível" : "Não foi possível agendar")}
        </p>
        <p className="leading-relaxed font-medium">{mensagem}</p>
        {isConflito && (
          <p className="text-xs opacity-90 pt-1">
            Dica: altere o horário, a data ou escolha outro profissional.
          </p>
        )}
      </div>
    </div>
  );
}
