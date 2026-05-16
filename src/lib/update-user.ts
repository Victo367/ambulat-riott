import User from "@/models/User";

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

function isValidDate(value: unknown): boolean {
  if (!value) return false;
  const date = new Date(value as string | Date);
  return !Number.isNaN(date.getTime());
}

export async function buildUserUpdateData(id: string, body: Record<string, unknown>) {
  const user = await User.findById(id).select("tipo_usuario");
  if (!user) {
    return {
      ok: false as const,
      status: 404,
      data: { error: "Usuário não encontrado" },
    };
  }

  const allowedFields =
    user.tipo_usuario === "paciente" ? pacienteFields : funcionarioFields;
  const updateData: Record<string, unknown> = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) updateData[key] = body[key];
  }

  if (Object.keys(updateData).length === 0) {
    return {
      ok: false as const,
      status: 400,
      data: { error: "Nenhum campo válido para atualizar" },
    };
  }

  if (
    updateData.data_nascimento !== undefined &&
    !isValidDate(updateData.data_nascimento)
  ) {
    return {
      ok: false as const,
      status: 400,
      data: { error: "Campo data_nascimento inválido" },
    };
  }

  if (
    updateData.data_admissao !== undefined &&
    !isValidDate(updateData.data_admissao)
  ) {
    return {
      ok: false as const,
      status: 400,
      data: { error: "Campo data_admissao inválido" },
    };
  }

  return {
    ok: true as const,
    status: 200,
    data: updateData,
  };
}
