import Funcionario from "@/models/Funcionario";
import {
  sanitizeCargo,
  sanitizeEmail,
  sanitizeNome,
  sanitizeSenha,
  validateFuncionarioApiBody,
} from "@/lib/field-validation";
import type { UserCreator } from "./types";

function buildFuncionarioPayload(body: Record<string, unknown>) {
  return {
    tipo_usuario: "funcionario" as const,
    nome: sanitizeNome(String(body.nome ?? "")),
    email: sanitizeEmail(String(body.email ?? "")),
    senha: sanitizeSenha(String(body.senha ?? ""), String(body.cargo ?? "")),
    status: body.status === "inativo" ? "inativo" : "ativo",
    cargo: sanitizeCargo(String(body.cargo ?? "")),
    data_admissao: new Date(body.data_admissao as string | Date),
  };
}

export class FuncionarioCreator implements UserCreator {
  validate(body: Record<string, unknown>) {
    return validateFuncionarioApiBody(body);
  }

  buildPayload(body: Record<string, unknown>) {
    return buildFuncionarioPayload(body);
  }

  async create(payload: Record<string, unknown>) {
    return Funcionario.create(payload);
  }
}
