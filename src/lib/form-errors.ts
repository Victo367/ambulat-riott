export type FormFieldErrors = Record<string, string>;

export type ApiErrorBody = {
  error?: string;
  fields?: FormFieldErrors;
};

/** Converte nomes de campo da API (snake_case) para chaves do formulário. */
const API_FIELD_TO_FORM: Record<string, string> = {
  identidade_genero: "identidadeGenero",
  data_nascimento: "dataNascimento",
  data_admissao: "dataAdmissao",
  profissional_id: "profissionalId",
  paciente_id: "pacienteId",
};

export function normalizeFieldKey(key: string): string {
  return API_FIELD_TO_FORM[key] ?? key;
}

export function normalizeFieldErrors(
  fields?: FormFieldErrors | null
): FormFieldErrors {
  if (!fields) return {};
  const out: FormFieldErrors = {};
  for (const [key, message] of Object.entries(fields)) {
    if (typeof message === "string" && message.trim()) {
      out[normalizeFieldKey(key)] = message.trim();
    }
  }
  return out;
}

/** Mensagens legadas: "Campo nome é obrigatório", "Campo email inválido", etc. */
export function parseLegacyCampoError(message: string): FormFieldErrors {
  const trimmed = message.trim();
  const match = trimmed.match(/^Campo\s+(\w+)\s+(.+)$/i);
  if (!match) return {};
  const [, rawField, rest] = match;
  const field = normalizeFieldKey(rawField);
  const detail = rest.replace(/^é\s+/i, "").trim();
  const text =
    detail.length > 0
      ? detail.charAt(0).toUpperCase() + detail.slice(1)
      : "Valor inválido";
  return { [field]: text };
}

export async function parseApiErrorResponse(
  res: Response,
  fallback = "Não foi possível concluir a operação."
): Promise<{ message: string; fields: FormFieldErrors }> {
  let body: ApiErrorBody = {};
  try {
    body = (await res.json()) as ApiErrorBody;
  } catch {
    // corpo vazio
  }

  let fields = normalizeFieldErrors(body.fields);
  const errorMsg =
    typeof body.error === "string" && body.error.trim()
      ? body.error.trim()
      : "";

  if (Object.keys(fields).length === 0 && errorMsg) {
    fields = parseLegacyCampoError(errorMsg);
  }

  if (errorMsg.toLowerCase().includes("e-mail já cadastrado")) {
    fields = { ...fields, email: "Este e-mail já está cadastrado" };
  }

  const message =
    errorMsg ||
    (res.status === 401
      ? "Sua sessão expirou. Faça login novamente."
      : res.status === 403
        ? "Você não tem permissão para esta ação."
        : res.status >= 500
          ? "Erro no servidor. Tente novamente em instantes."
          : fallback);

  return { message, fields };
}

export function inputWithError(baseClass: string, fieldError?: string) {
  if (!fieldError) return baseClass;
  return `${baseClass} border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500/15`;
}

export function mergeFieldErrors(
  ...sources: (FormFieldErrors | undefined)[]
): FormFieldErrors {
  return Object.assign({}, ...sources.filter(Boolean));
}
