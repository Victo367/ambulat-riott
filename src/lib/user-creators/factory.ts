import { PacienteCreator } from "./paciente-creator";
import { FuncionarioCreator } from "./funcionario-creator";
import type { UserCreator } from "./types";

export type TipoUsuario = "paciente" | "funcionario";

export function createUserCreator(tipo: TipoUsuario): UserCreator {
  if (tipo === "paciente") return new PacienteCreator();
  return new FuncionarioCreator();
}
