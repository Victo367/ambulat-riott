import Funcionario from "@/models/Funcionario";
import Paciente from "@/models/Paciente";
import type { FormFieldErrors } from "@/lib/form-errors";

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

function isValidDate(value: unknown): boolean {
  if (!value) return false;
  const date = new Date(value as string | Date);
  return !Number.isNaN(date.getTime());
}

function validateBaseFields(body: RegisterInput): FormFieldErrors {
  const fields: FormFieldErrors = {};
  if (!body.nome?.trim()) fields.nome = "Informe o nome completo";
  if (!body.email?.trim()) {
    fields.email = "Informe o e-mail";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    fields.email = "E-mail inválido";
  }
  if (!body.senha?.trim()) {
    fields.senha = "Informe a senha";
  } else if (body.senha.trim().length < 8) {
    fields.senha = "A senha deve ter no mínimo 8 caracteres";
  }
  return fields;
}

function validatePaciente(body: RegisterInput): FormFieldErrors {
  const fields = validateBaseFields(body);
  if (!body.pronomes?.trim()) fields.pronomes = "Informe os pronomes";
  if (!body.identidade_genero?.trim()) {
    fields.identidade_genero = "Informe a identidade de gênero";
  }
  if (!body.telefone?.trim()) fields.telefone = "Informe o telefone";
  if (!isValidDate(body.data_nascimento)) {
    fields.data_nascimento = "Data de nascimento inválida";
  }
  if (
    body.terapia_hormonal !== undefined &&
    typeof body.terapia_hormonal !== "boolean"
  ) {
    fields.terapia_hormonal = "Valor inválido para terapia hormonal";
  }
  return fields;
}

function validateFuncionario(body: RegisterInput): FormFieldErrors {
  const fields = validateBaseFields(body);
  if (!body.cargo?.trim()) fields.cargo = "Informe o cargo";
  if (!isValidDate(body.data_admissao)) {
    fields.data_admissao = "Data de admissão inválida";
  }
  return fields;
}

function sanitizeUser(user: { toObject: () => Record<string, unknown> }) {
  const userObj = user.toObject();
  delete userObj.senha;
  return userObj;
}

function sanitizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function buildPacientePayload(body: RegisterInput) {
  return {
    tipo_usuario: "paciente" as const,
    nome: sanitizeText(body.nome),
    email: sanitizeText(body.email).toLowerCase(),
    senha: sanitizeText(body.senha),
    status: body.status === "inativo" ? "inativo" : "ativo",
    pronomes: sanitizeText(body.pronomes),
    identidade_genero: sanitizeText(body.identidade_genero),
    data_nascimento: new Date(body.data_nascimento as string | Date),
    telefone: sanitizeText(body.telefone),
    terapia_hormonal: Boolean(body.terapia_hormonal),
    dosagem_hormonio: sanitizeText(body.dosagem_hormonio),
    bloqueador_hormonal: sanitizeText(body.bloqueador_hormonal),
  };
}

function buildFuncionarioPayload(body: RegisterInput) {
  return {
    tipo_usuario: "funcionario" as const,
    nome: sanitizeText(body.nome),
    email: sanitizeText(body.email).toLowerCase(),
    senha: sanitizeText(body.senha),
    status: body.status === "inativo" ? "inativo" : "ativo",
    cargo: sanitizeText(body.cargo),
    data_admissao: new Date(body.data_admissao as string | Date),
  };
}

export async function createUserByType(body: RegisterInput, tipo: TipoUsuario) {
  const fieldErrors =
    tipo === "paciente" ? validatePaciente(body) : validateFuncionario(body);

  if (Object.keys(fieldErrors).length > 0) {
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
