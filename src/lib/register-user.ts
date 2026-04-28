import Funcionario from "@/models/Funcionario";
import Paciente from "@/models/Paciente";

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
  cargo?: string;
  data_admissao?: string | Date;
};

function isValidDate(value: unknown): boolean {
  if (!value) return false;
  const date = new Date(value as string | Date);
  return !Number.isNaN(date.getTime());
}

function validateBaseFields(body: RegisterInput) {
  if (!body.nome?.trim()) return "Campo nome é obrigatório";
  if (!body.email?.trim()) return "Campo email é obrigatório";
  if (!body.senha?.trim()) return "Campo senha é obrigatório";
  if (body.senha.trim().length < 8) {
    return "Campo senha deve ter no mínimo 8 caracteres";
  }
  return null;
}

function validatePaciente(body: RegisterInput) {
  const baseError = validateBaseFields(body);
  if (baseError) return baseError;
  if (!body.pronomes?.trim()) return "Campo pronomes é obrigatório";
  if (!body.identidade_genero?.trim()) {
    return "Campo identidade_genero é obrigatório";
  }
  if (!body.telefone?.trim()) return "Campo telefone é obrigatório";
  if (!isValidDate(body.data_nascimento)) {
    return "Campo data_nascimento inválido";
  }
  if (
    body.terapia_hormonal !== undefined &&
    typeof body.terapia_hormonal !== "boolean"
  ) {
    return "Campo terapia_hormonal deve ser booleano";
  }
  return null;
}

function validateFuncionario(body: RegisterInput) {
  const baseError = validateBaseFields(body);
  if (baseError) return baseError;
  if (!body.cargo?.trim()) return "Campo cargo é obrigatório";
  if (!isValidDate(body.data_admissao)) {
    return "Campo data_admissao inválido";
  }
  return null;
}

function sanitizeUser(user: any) {
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
  const validationError =
    tipo === "paciente" ? validatePaciente(body) : validateFuncionario(body);

  if (validationError) {
    return {
      ok: false as const,
      status: 400,
      data: { error: validationError },
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
  } catch (error: any) {
    if (error?.code === 11000) {
      return {
        ok: false as const,
        status: 409,
        data: { error: "E-mail já cadastrado" },
      };
    }

    return {
      ok: false as const,
      status: 500,
      data: { error: error?.message || "Erro interno no cadastro" },
    };
  }
}

export function parseTipoUsuario(body: RegisterInput): TipoUsuario | null {
  if (body.tipo_usuario === "paciente" || body.tipo_usuario === "funcionario") {
    return body.tipo_usuario;
  }
  return null;
}
