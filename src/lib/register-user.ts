import Funcionario from "@/models/Funcionario";
import Paciente from "@/models/Paciente";
import type { FormFieldErrors } from "@/lib/form-errors";
import {
  sanitizeCargo,
  sanitizeEmail,
  sanitizeIdentidadeGenero,
  sanitizeNome,
  sanitizePronomes,
  sanitizeSenha,
  sanitizeTerapiaTexto,
  telefoneDigitos,
  validateFuncionarioApiBody,
  validatePacienteApiBody,
  hasFieldErrors,
} from "@/lib/field-validation";

type TipoUsuario = "paciente" | "funcionario";

type RegisterInput = {
  tipo_usuario?: string;
  nome?: string;
  email?: string;
  senha?: string;
  status?: "ativo" | "inativo";
  pronomes?: string;
  identidade_genero?: string;
  data_nascimento?: string | Date;
  telefone?: string;
  terapia_hormonal?: boolean;
  dosagem_hormonio?: string;
  bloqueador_hormonal?: string;
  cargo?: string;
  data_admissao?: string | Date;
};

function sanitizeUser(user: { toObject: () => Record<string, unknown> }) {
  const userObj = user.toObject();
  delete userObj.senha;
  return userObj;
}

function buildPacientePayload(body: RegisterInput) {
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

function buildFuncionarioPayload(body: RegisterInput) {
  return {
    tipo_usuario: "funcionario" as const,
    nome: sanitizeNome(String(body.nome ?? "")),
    email: sanitizeEmail(String(body.email ?? "")),
    senha: sanitizeSenha(String(body.senha ?? "")),
    status: body.status === "inativo" ? "inativo" : "ativo",
    cargo: sanitizeCargo(String(body.cargo ?? "")),
    data_admissao: new Date(body.data_admissao as string | Date),
  };
}

export async function createUserByType(body: RegisterInput, tipo: TipoUsuario) {
  const fieldErrors: FormFieldErrors =
    tipo === "paciente"
      ? validatePacienteApiBody(body as Record<string, unknown>)
      : validateFuncionarioApiBody(body as Record<string, unknown>);

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

  try {
    const user =
      tipo === "paciente"
        ? await Paciente.create(buildPacientePayload(body))
        : await Funcionario.create(buildFuncionarioPayload(body));

    return {
      ok: true as const,
      status: 201,
      data: sanitizeUser(user),
    };
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err?.code === 11000) {
      return {
        ok: false as const,
        status: 409,
        data: {
          error: "E-mail já cadastrado",
          fields: { email: "Este e-mail já está cadastrado" },
        },
      };
    }

    return {
      ok: false as const,
      status: 500,
      data: {
        error: err?.message || "Erro interno no cadastro",
      },
    };
  }
}

export function parseTipoUsuario(body: RegisterInput): TipoUsuario | null {
  if (body.tipo_usuario === "paciente" || body.tipo_usuario === "funcionario") {
    return body.tipo_usuario;
  }
  return null;
}
