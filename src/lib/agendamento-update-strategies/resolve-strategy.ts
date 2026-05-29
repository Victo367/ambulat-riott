import { AgendamentoDomainError } from "@/lib/agendamento/errors";
import { PacienteUpdateStrategy } from "./paciente-update-strategy";
import { FuncionarioUpdateStrategy } from "./funcionario-update-strategy";
import type { AgendamentoUpdateStrategy } from "./types";

export function resolveUpdateStrategy(tipo: string): AgendamentoUpdateStrategy {
  if (tipo === "paciente") return new PacienteUpdateStrategy();
  if (tipo === "funcionario") return new FuncionarioUpdateStrategy();
  throw new AgendamentoDomainError(403, "Acesso negado");
}
