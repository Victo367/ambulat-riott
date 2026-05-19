import type { FormFieldErrors } from "@/lib/form-errors";

export const LIMITS = {
  nome: { min: 3, max: 120 },
  email: { min: 5, max: 254 },
  senha: { min: 8, max: 72 },
  /** Desenvolvedores: sem regras de complexidade (apenas tamanho máximo). */
  senhaDev: { max: 256 },
  telefoneDigits: { min: 10, max: 11 },
  pronomes: { min: 2, max: 40 },
  identidadeGenero: { min: 2, max: 80 },
  endereco: { min: 5, max: 200 },
  cargo: { min: 2, max: 80 },
  terapiaTexto: { max: 120 },
  observacoes: { max: 500 },
  cpfDigits: 11,
} as const;

const RE = {
  nome: /^[\p{L}\s'’.-]+$/u,
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
  pronomes: /^[\p{L}\s/]+$/u,
  identidadeGenero: /^[\p{L}\s0-9'’.-]+$/u,
  cargo: /^[\p{L}\s0-9'’.-/]+$/u,
  endereco: /^[\p{L}\p{N}\s.,ºª°\-#/]+$/u,
  terapia: /^[\p{L}\p{N}\s.,/%\-+]+$/u,
  senha: /^[\x20-\x7E]+$/,
} as const;

function hojeIsoLocal(): string {
  const hoje = new Date();
  const y = hoje.getFullYear();
  const m = String(hoje.getMonth() + 1).padStart(2, "0");
  const d = String(hoje.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isoFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Data mínima de nascimento (~120 anos). */
export function minDataNascimentoIso(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 120);
  return isoFromDate(d);
}

export function maxDataNascimentoIso(): string {
  return hojeIsoLocal();
}

/** Admissão: a partir de 1970 até hoje. */
export function minDataAdmissaoIso(): string {
  return "1970-01-01";
}

export function maxDataAdmissaoIso(): string {
  return hojeIsoLocal();
}

export function minDataAgendamentoIso(): string {
  return hojeIsoLocal();
}

/** Limite de agendamento: até 1 ano à frente. */
export function maxDataAgendamentoIso(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return isoFromDate(d);
}

// --- Sanitização (impede digitar caracteres inválidos) ---

export function sanitizeNome(value: string): string {
  return value
    .replace(/[^\p{L}\s'’.-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, LIMITS.nome.max);
}

export function sanitizeEmail(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/[^a-z0-9@._%+-]/g, "")
    .slice(0, LIMITS.email.max);
}

/** Cargos de TI/desenvolvimento: senha livre (sem regras de complexidade). */
export function isCargoDesenvolvedor(cargo: string): boolean {
  const n = cargo.toLowerCase().trim();
  return (
    n.includes("desenvolvedor") ||
    n.includes("developer") ||
    n === "dev" ||
    n.startsWith("dev ") ||
    n.endsWith(" dev") ||
    n.includes("programador")
  );
}

export function sanitizeSenha(value: string, cargo?: string): string {
  if (cargo && isCargoDesenvolvedor(cargo)) {
    return value.slice(0, LIMITS.senhaDev.max);
  }
  return value.replace(/[^\x20-\x7E]/g, "").slice(0, LIMITS.senha.max);
}

export function sanitizePronomes(value: string): string {
  return value
    .replace(/[^\p{L}\s/]/gu, "")
    .slice(0, LIMITS.pronomes.max);
}

export function sanitizeIdentidadeGenero(value: string): string {
  return value
    .replace(/[^\p{L}\s0-9'’.-]/gu, "")
    .slice(0, LIMITS.identidadeGenero.max);
}

export function sanitizeCargo(value: string): string {
  return value
    .replace(/[^\p{L}\s0-9'’.-/]/gu, "")
    .slice(0, LIMITS.cargo.max);
}

export function sanitizeEndereco(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}\s.,ºª°\-#/]/gu, "")
    .slice(0, LIMITS.endereco.max);
}

export function sanitizeTerapiaTexto(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}\s.,/%\-+]/gu, "")
    .slice(0, LIMITS.terapiaTexto.max);
}

export function sanitizeObservacoes(value: string): string {
  return value.slice(0, LIMITS.observacoes.max);
}

export function onlyDigits(value: string, max?: number): string {
  const d = value.replace(/\D/g, "");
  return max !== undefined ? d.slice(0, max) : d;
}

/** Máscara brasileira: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX */
export function formatTelefoneBr(value: string): string {
  const d = onlyDigits(value, LIMITS.telefoneDigits.max);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatCpf(value: string): string {
  const d = onlyDigits(value, LIMITS.cpfDigits);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function telefoneDigitos(value: string): string {
  return onlyDigits(value, LIMITS.telefoneDigits.max);
}

export function cpfDigitos(value: string): string {
  return onlyDigits(value, LIMITS.cpfDigits);
}

// --- Validação ---

function validateNomeField(value: string): string | null {
  const v = value.trim();
  if (!v) return "Informe o nome completo";
  if (v.length < LIMITS.nome.min) {
    return `O nome deve ter pelo menos ${LIMITS.nome.min} caracteres`;
  }
  if (!RE.nome.test(v)) {
    return "Use apenas letras, espaços e hífen no nome";
  }
  if (!/\p{L}/u.test(v)) return "O nome deve conter letras";
  return null;
}

function validateEmailField(value: string): string | null {
  const v = sanitizeEmail(value);
  if (!v) return "Informe o e-mail";
  if (v.length < LIMITS.email.min) return "E-mail muito curto";
  if (!RE.email.test(v)) return "Informe um e-mail válido (ex: nome@clinica.com)";
  return null;
}

function validateSenhaField(
  value: string,
  { required = true, cargo }: { required?: boolean; cargo?: string } = {}
): string | null {
  const v = value;
  if (!v) return required ? "Informe a senha" : null;

  if (cargo && isCargoDesenvolvedor(cargo)) {
    if (v.length > LIMITS.senhaDev.max) {
      return `A senha deve ter no máximo ${LIMITS.senhaDev.max} caracteres`;
    }
    return null;
  }

  if (v.length < LIMITS.senha.min) {
    return `A senha deve ter no mínimo ${LIMITS.senha.min} caracteres`;
  }
  if (v.length > LIMITS.senha.max) {
    return `A senha deve ter no máximo ${LIMITS.senha.max} caracteres`;
  }
  if (!RE.senha.test(v)) return "A senha contém caracteres não permitidos";
  if (/\s/.test(v)) return "A senha não pode conter espaços";
  return null;
}

function validateTelefoneField(value: string): string | null {
  const d = telefoneDigitos(value);
  if (!d) return "Informe o telefone";
  if (d.length < LIMITS.telefoneDigits.min) {
    return "Telefone incompleto (DDD + número)";
  }
  if (d[0] === "0") return "O DDD não pode começar com 0";
  const nono = d.length === 11 ? d[2] : null;
  if (nono !== null && nono !== "9") {
    return "Celular deve ter 9 dígitos após o DDD (ex: (11) 91234-5678)";
  }
  return null;
}

function validatePronomesField(value: string): string | null {
  const v = value.trim();
  if (!v) return "Informe os pronomes";
  if (v.length < LIMITS.pronomes.min) return "Pronomes muito curtos";
  if (!RE.pronomes.test(v)) return "Use apenas letras e barra (ex: Ele/Dele)";
  return null;
}

function validateIdentidadeGeneroField(value: string): string | null {
  const v = value.trim();
  if (!v) return "Informe a identidade de gênero";
  if (v.length < LIMITS.identidadeGenero.min) return "Descrição muito curta";
  if (!RE.identidadeGenero.test(v)) return "Use apenas letras e números";
  return null;
}

function validateEnderecoField(value: string): string | null {
  const v = value.trim();
  if (!v) return "Informe o endereço";
  if (v.length < LIMITS.endereco.min) return "Endereço muito curto";
  if (!RE.endereco.test(v)) return "Endereço contém caracteres inválidos";
  if (!/\p{L}/u.test(v)) return "Informe o nome da rua ou logradouro";
  return null;
}

function validateCargoField(value: string): string | null {
  const v = value.trim();
  if (!v) return "Informe o cargo";
  if (v.length < LIMITS.cargo.min) return "Cargo muito curto";
  if (!RE.cargo.test(v)) return "Cargo contém caracteres inválidos";
  return null;
}

function validateDataIso(
  value: string,
  opts: { min?: string; max?: string; label: string }
): string | null {
  if (!value?.trim()) return `Informe ${opts.label}`;
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return `${opts.label} inválida`;
  if (opts.min && value < opts.min) {
    return `${opts.label} não pode ser anterior a ${formatDataBr(opts.min)}`;
  }
  if (opts.max && value > opts.max) {
    return `${opts.label} não pode ser posterior a ${formatDataBr(opts.max)}`;
  }
  return null;
}

function formatDataBr(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function validateCpfOpcional(value: string): string | null {
  const d = cpfDigitos(value);
  if (!d) return null;
  if (d.length !== LIMITS.cpfDigits) return "CPF deve ter 11 dígitos";
  if (/^(\d)\1{10}$/.test(d)) return "CPF inválido";
  return validarCpfDigitos(d) ? null : "CPF inválido";
}

function validarCpfDigitos(d: string): boolean {
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(d[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(d[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(d[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  return resto === Number(d[10]);
}

function validateTerapiaOpcional(value: string, label: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (v.length > LIMITS.terapiaTexto.max) {
    return `${label} deve ter no máximo ${LIMITS.terapiaTexto.max} caracteres`;
  }
  if (!RE.terapia.test(v)) return `${label} contém caracteres inválidos`;
  return null;
}

export function validateLoginForm(data: {
  email: string;
  senha: string;
}): FormFieldErrors {
  const fields: FormFieldErrors = {};
  const emailErr = validateEmailField(data.email);
  if (emailErr) fields.email = emailErr;
  if (!data.senha?.trim()) fields.senha = "Informe a senha";
  return fields;
}

export function validatePacienteForm(data: {
  nome: string;
  email: string;
  senha: string;
  pronomes: string;
  identidadeGenero: string;
  dataNascimento: string;
  telefone: string;
  endereco?: string;
  cpf?: string;
  dosagem_hormonio?: string;
  bloqueador_hormonal?: string;
  senhaObrigatoria?: boolean;
}): FormFieldErrors {
  const fields: FormFieldErrors = {};
  const map: [string, string | null][] = [
    ["nome", validateNomeField(data.nome)],
    ["email", validateEmailField(data.email)],
    [
      "senha",
      validateSenhaField(data.senha, {
        required: data.senhaObrigatoria !== false,
      }),
    ],
    ["pronomes", validatePronomesField(data.pronomes)],
    ["identidadeGenero", validateIdentidadeGeneroField(data.identidadeGenero)],
    [
      "dataNascimento",
      validateDataIso(data.dataNascimento, {
        label: "a data de nascimento",
        min: minDataNascimentoIso(),
        max: maxDataNascimentoIso(),
      }),
    ],
    ["telefone", validateTelefoneField(data.telefone)],
    [
      "endereco",
      data.endereco !== undefined
        ? validateEnderecoField(data.endereco)
        : null,
    ],
    ["cpf", validateCpfOpcional(data.cpf || "")],
    [
      "dosagem_hormonio",
      validateTerapiaOpcional(data.dosagem_hormonio || "", "Dosagem"),
    ],
    [
      "bloqueador_hormonal",
      validateTerapiaOpcional(data.bloqueador_hormonal || "", "Bloqueador"),
    ],
  ];

  for (const [key, err] of map) {
    if (err) fields[key] = err;
  }
  return fields;
}

export function validateFuncionarioForm(data: {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
  dataAdmissao: string;
  senhaObrigatoria?: boolean;
}): FormFieldErrors {
  const fields: FormFieldErrors = {};
  const map: [string, string | null][] = [
    ["nome", validateNomeField(data.nome)],
    ["email", validateEmailField(data.email)],
    [
      "senha",
      validateSenhaField(data.senha, {
        required: data.senhaObrigatoria !== false,
        cargo: data.cargo,
      }),
    ],
    ["cargo", validateCargoField(data.cargo)],
    [
      "dataAdmissao",
      validateDataIso(data.dataAdmissao, {
        label: "a data de admissão",
        min: minDataAdmissaoIso(),
        max: maxDataAdmissaoIso(),
      }),
    ],
  ];

  for (const [key, err] of map) {
    if (err) fields[key] = err;
  }
  return fields;
}

/** Validação server-side (chaves snake_case da API). */
export function validatePacienteApiBody(body: Record<string, unknown>): FormFieldErrors {
  const fields = validatePacienteForm({
    nome: String(body.nome ?? ""),
    email: String(body.email ?? ""),
    senha: String(body.senha ?? ""),
    pronomes: String(body.pronomes ?? ""),
    identidadeGenero: String(body.identidade_genero ?? ""),
    dataNascimento: String(body.data_nascimento ?? "").split("T")[0],
    telefone: String(body.telefone ?? ""),
    dosagem_hormonio: String(body.dosagem_hormonio ?? ""),
    bloqueador_hormonal: String(body.bloqueador_hormonal ?? ""),
    senhaObrigatoria: Boolean(body.senha),
  });

  const apiFields: FormFieldErrors = {};
  const keyMap: Record<string, string> = {
    identidadeGenero: "identidade_genero",
    dataNascimento: "data_nascimento",
  };
  for (const [k, v] of Object.entries(fields)) {
    apiFields[keyMap[k] ?? k] = v;
  }
  return apiFields;
}

export function validateFuncionarioApiBody(
  body: Record<string, unknown>
): FormFieldErrors {
  const cargo = String(body.cargo ?? "");
  const fields = validateFuncionarioForm({
    nome: String(body.nome ?? ""),
    email: String(body.email ?? ""),
    senha: String(body.senha ?? ""),
    cargo,
    dataAdmissao: String(body.data_admissao ?? "").split("T")[0],
    senhaObrigatoria: Boolean(body.senha),
  });

  const apiFields: FormFieldErrors = {};
  const keyMap: Record<string, string> = {
    dataAdmissao: "data_admissao",
  };
  for (const [k, v] of Object.entries(fields)) {
    apiFields[keyMap[k] ?? k] = v;
  }
  return apiFields;
}

export function validateLoginApiBody(body: Record<string, unknown>): FormFieldErrors {
  return validateLoginForm({
    email: String(body.email ?? ""),
    senha: String(body.senha ?? ""),
  });
}

export function hasFieldErrors(fields: FormFieldErrors): boolean {
  return Object.keys(fields).length > 0;
}

export function validatePacienteUpdateBody(
  body: Record<string, unknown>
): FormFieldErrors {
  const fields: FormFieldErrors = {};
  if (body.nome !== undefined) {
    const err = validateNomeField(String(body.nome));
    if (err) fields.nome = err;
  }
  if (body.email !== undefined) {
    const err = validateEmailField(String(body.email));
    if (err) fields.email = err;
  }
  if (body.pronomes !== undefined) {
    const err = validatePronomesField(String(body.pronomes));
    if (err) fields.pronomes = err;
  }
  if (body.identidade_genero !== undefined) {
    const err = validateIdentidadeGeneroField(String(body.identidade_genero));
    if (err) fields.identidade_genero = err;
  }
  if (body.data_nascimento !== undefined) {
    const err = validateDataIso(String(body.data_nascimento).split("T")[0], {
      label: "a data de nascimento",
      min: minDataNascimentoIso(),
      max: maxDataNascimentoIso(),
    });
    if (err) fields.data_nascimento = err;
  }
  if (body.telefone !== undefined) {
    const err = validateTelefoneField(String(body.telefone));
    if (err) fields.telefone = err;
  }
  if (body.dosagem_hormonio !== undefined) {
    const err = validateTerapiaOpcional(
      String(body.dosagem_hormonio),
      "Dosagem"
    );
    if (err) fields.dosagem_hormonio = err;
  }
  if (body.bloqueador_hormonal !== undefined) {
    const err = validateTerapiaOpcional(
      String(body.bloqueador_hormonal),
      "Bloqueador"
    );
    if (err) fields.bloqueador_hormonal = err;
  }
  if (body.status !== undefined) {
    const s = String(body.status);
    if (s !== "ativo" && s !== "inativo") {
      fields.status = "Status inválido";
    }
  }
  return fields;
}

export function validateFuncionarioUpdateBody(
  body: Record<string, unknown>
): FormFieldErrors {
  const fields: FormFieldErrors = {};
  if (body.nome !== undefined) {
    const err = validateNomeField(String(body.nome));
    if (err) fields.nome = err;
  }
  if (body.email !== undefined) {
    const err = validateEmailField(String(body.email));
    if (err) fields.email = err;
  }
  if (body.cargo !== undefined) {
    const err = validateCargoField(String(body.cargo));
    if (err) fields.cargo = err;
  }
  if (body.data_admissao !== undefined) {
    const err = validateDataIso(String(body.data_admissao).split("T")[0], {
      label: "a data de admissão",
      min: minDataAdmissaoIso(),
      max: maxDataAdmissaoIso(),
    });
    if (err) fields.data_admissao = err;
  }
  if (body.status !== undefined) {
    const s = String(body.status);
    if (s !== "ativo" && s !== "inativo") {
      fields.status = "Status inválido";
    }
  }
  return fields;
}
