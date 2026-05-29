import Paciente from "@/models/Paciente";
import {
  sanitizeEmail,
  sanitizeIdentidadeGenero,
  sanitizeNome,
  sanitizePronomes,
  sanitizeSenha,
  sanitizeTerapiaTexto,
  telefoneDigitos,
  validatePacienteApiBody,
} from "@/lib/field-validation";
import type { UserCreator } from "./types";

function buildPacientePayload(body: Record<string, unknown>) {
  return {
    tipo_usuario: "paciente" as const,
    nome: sanitizeNome(String(body.nome ?? "")),
    email: sanitizeEmail(String(body.email ?? "")),
    senha: sanitizeSenha(String(body.senha ?? "")),
    status: body.status === "inativo" ? "inativo" : "ativo",
    pronomes: sanitizePronomes(String(body.pronomes ?? "")),
    identidade_genero: sanitizeIdentidadeGenero(
      String(body.identidade_genero ?? "")
    ),
    data_nascimento: new Date(body.data_nascimento as string | Date),
    telefone: telefoneDigitos(String(body.telefone ?? "")),
    terapia_hormonal: Boolean(body.terapia_hormonal),
    dosagem_hormonio: sanitizeTerapiaTexto(String(body.dosagem_hormonio ?? "")),
    bloqueador_hormonal: sanitizeTerapiaTexto(
      String(body.bloqueador_hormonal ?? "")
    ),
  };
}

export class PacienteCreator implements UserCreator {
  validate(body: Record<string, unknown>) {
    return validatePacienteApiBody(body);
  }

  buildPayload(body: Record<string, unknown>) {
    return buildPacientePayload(body);
  }

  async create(payload: Record<string, unknown>) {
    return Paciente.create(payload);
  }
}
