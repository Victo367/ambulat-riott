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
        ? await Paciente.create({ ...body, tipo_usuario: "paciente" })
        : await Funcionario.create({ ...body, tipo_usuario: "funcionario" });

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
