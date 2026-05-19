import User from "@/models/User";
import type { FormFieldErrors } from "@/lib/form-errors";
import {
  sanitizeCargo,
  sanitizeEmail,
  sanitizeIdentidadeGenero,
  sanitizeNome,
  sanitizePronomes,
  sanitizeTerapiaTexto,
  telefoneDigitos,
  validateFuncionarioUpdateBody,
  validatePacienteUpdateBody,
  hasFieldErrors,
} from "@/lib/field-validation";

const baseFields = ["nome", "email", "status"];
const pacienteFields = [
  ...baseFields,
  "pronomes",
  "identidade_genero",
  "data_nascimento",
  "telefone",
  "terapia_hormonal",
  "dosagem_hormonio",
  "bloqueador_hormonal",
];
const funcionarioFields = [...baseFields, "cargo", "data_admissao"];

function sanitizeUpdateData(
  tipo: "paciente" | "funcionario",
  data: Record<string, unknown>
): Record<string, unknown> {
  const out = { ...data };
  if (typeof out.nome === "string") out.nome = sanitizeNome(out.nome);
  if (typeof out.email === "string") out.email = sanitizeEmail(out.email);
  if (typeof out.pronomes === "string") out.pronomes = sanitizePronomes(out.pronomes);
  if (typeof out.identidade_genero === "string") {
    out.identidade_genero = sanitizeIdentidadeGenero(out.identidade_genero);
  }
  if (typeof out.telefone === "string") {
    out.telefone = telefoneDigitos(out.telefone);
  }
  if (typeof out.cargo === "string") out.cargo = sanitizeCargo(out.cargo);
  if (typeof out.dosagem_hormonio === "string") {
    out.dosagem_hormonio = sanitizeTerapiaTexto(out.dosagem_hormonio);
  }
  if (typeof out.bloqueador_hormonal === "string") {
    out.bloqueador_hormonal = sanitizeTerapiaTexto(out.bloqueador_hormonal);
  }
  if (tipo === "paciente" && out.telefone) {
    const dosagem = String(out.dosagem_hormonio ?? "").trim();
    const bloqueador = String(out.bloqueador_hormonal ?? "").trim();
    out.terapia_hormonal = Boolean(dosagem || bloqueador);
  }
  return out;
}

export async function buildUserUpdateData(
  id: string,
  body: Record<string, unknown>
) {
  const user = await User.findById(id).select("tipo_usuario");
  if (!user) {
    return {
      ok: false as const,
      status: 404,
      data: { error: "Usuário não encontrado" },
    };
  }

  const tipo = user.tipo_usuario as "paciente" | "funcionario";
  const allowedFields =
    tipo === "paciente" ? pacienteFields : funcionarioFields;
  const updateData: Record<string, unknown> = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) updateData[key] = body[key];
  }

  if (Object.keys(updateData).length === 0) {
    return {
      ok: false as const,
      status: 400,
      data: {
        error: "Nenhum campo válido para atualizar",
        fields: { _form: "Nenhum dado foi alterado" },
      },
    };
  }

  const fieldErrors: FormFieldErrors =
    tipo === "paciente"
      ? validatePacienteUpdateBody(updateData)
      : validateFuncionarioUpdateBody(updateData);

  if (hasFieldErrors(fieldErrors)) {
    return {
      ok: false as const,
      status: 400,
      data: {
        error: "Verifique os campos destacados abaixo",
        fields: fieldErrors,
      },
    };
  }

  return {
    ok: true as const,
    status: 200,
    data: sanitizeUpdateData(tipo, updateData),
  };
}
