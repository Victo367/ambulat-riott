import type { FormFieldErrors } from "@/lib/form-errors";
import { hasFieldErrors } from "@/lib/field-validation";
import { createUserCreator, type TipoUsuario } from "@/lib/user-creators/factory";

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

export async function createUserByType(body: RegisterInput, tipo: TipoUsuario) {
  const creator = createUserCreator(tipo);
  const fieldErrors: FormFieldErrors = creator.validate(
    body as Record<string, unknown>
  );

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
    const payload = creator.buildPayload(body as Record<string, unknown>);
    const user = await creator.create(payload);

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
