export const STATUS_VALUES = [
  "confirmado",
  "pendente",
  "cancelado",
  "realizado",
  "ausente",
] as const;

export type StatusAgendamento = (typeof STATUS_VALUES)[number];

const STATUS_LABELS: Record<StatusAgendamento, string> = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  cancelado: "Cancelado",
  realizado: "Realizado",
  ausente: "Ausente",
};

export function formatStatusLabel(status: string) {
  return STATUS_LABELS[status as StatusAgendamento] || status;
}

export function normalizeStatus(status: unknown): StatusAgendamento | null {
  if (typeof status !== "string") return null;
  const value = status.toLowerCase().trim();
  return STATUS_VALUES.includes(value as StatusAgendamento)
    ? (value as StatusAgendamento)
    : null;
}

export function formatDataExibicao(dataIso: string) {
  const [year, month, day] = dataIso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function hojeIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function normalizarHora(hora: string) {
  const partes = hora.trim().split(":");
  if (partes.length < 2) return hora.trim();
  return `${partes[0].padStart(2, "0")}:${partes[1].padStart(2, "0")}`;
}

export function normalizarDataIso(data: string) {
  return data.trim().slice(0, 10);
}

function getTerapiaPaciente(paciente: Record<string, unknown> | null) {
  if (!paciente) return { dosagem_hormonio: "", bloqueador_hormonal: "" };
  const emTerapia =
    Boolean(paciente.terapia_hormonal) ||
    Boolean(paciente.dosagem_hormonio) ||
    Boolean(paciente.bloqueador_hormonal);
  if (!emTerapia) return { dosagem_hormonio: "", bloqueador_hormonal: "" };
  return {
    dosagem_hormonio: String(paciente.dosagem_hormonio || ""),
    bloqueador_hormonal: String(paciente.bloqueador_hormonal || ""),
  };
}

export const ESPECIALIDADE_CARGO: Record<string, string[]> = {
  clinico: ["clínico", "clinico", "geral"],
  psicologia: ["psicolog", "psicólog"],
  hormonal: ["endocrin", "hormon"],
  nutricao: ["nutric"],
};

export const ESPECIALIDADE_LABELS: Record<string, string> = {
  clinico: "Clínico Geral",
  psicologia: "Acompanhamento Psicológico",
  hormonal: "Terapia Hormonal",
  nutricao: "Nutrição",
};

export function labelEspecialidade(especialidade: string, tipo?: string) {
  const key = (especialidade || "").toLowerCase();
  if (ESPECIALIDADE_LABELS[key]) return ESPECIALIDADE_LABELS[key];
  if (especialidade) return especialidade;
  return tipo || "Consulta";
}

export function serializeAgendamento(doc: Record<string, unknown>) {
  const paciente = doc.paciente as Record<string, unknown> | null;
  const profissional = doc.profissional as Record<string, unknown> | null;
  const status = String(doc.status || "pendente");

  return {
    id: String(doc._id),
    paciente: paciente ? String(paciente.nome) : "Paciente",
    pacienteId: paciente ? String(paciente._id) : "",
    profissional: profissional ? String(profissional.nome) : "Profissional",
    profissionalId: profissional ? String(profissional._id) : "",
    hora: String(doc.hora),
    data: String(doc.data),
    dataFormatada: formatDataExibicao(String(doc.data)),
    tipo: String(doc.tipo || "Consulta"),
    especialidade: doc.especialidade ? String(doc.especialidade) : "",
    especialidadeLabel: labelEspecialidade(
      doc.especialidade ? String(doc.especialidade) : "",
      String(doc.tipo || "Consulta")
    ),
    status: formatStatusLabel(status),
    statusValue: status,
    modalidade: String(doc.modalidade || "Presencial"),
    observacoes: String(doc.observacoes || ""),
    pacienteTerapia: getTerapiaPaciente(paciente),
    historico: Array.isArray(doc.historico)
      ? doc.historico.map((item: Record<string, unknown>) => ({
          acao: String(item.acao),
          data: item.data,
          usuarioNome: item.usuarioNome ? String(item.usuarioNome) : "",
        }))
      : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function dataAgendamentoParaDate(data: string, hora: string) {
  const [year, month, day] = normalizarDataIso(data).split("-").map(Number);
  const [hh, mm] = normalizarHora(hora).split(":").map(Number);
  return new Date(year, month - 1, day, hh, mm || 0);
}

export function formatDataCurta(dataIso: string) {
  const iso = normalizarDataIso(dataIso);
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDiaSemana(dataIso: string) {
  const [year, month, day] = normalizarDataIso(dataIso).split("-").map(Number);
  const label = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(
    new Date(year, month - 1, day)
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function partesDataCard(dataIso: string) {
  const [year, month, day] = normalizarDataIso(dataIso).split("-").map(Number);
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(new Date(year, month - 1, day))
    .replace(".", "");
  return { dia: String(day).padStart(2, "0"), mes };
}
