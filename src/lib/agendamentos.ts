import Agendamento from "@/models/Agendamento";
import User from "@/models/User";

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

export async function findAgendamentoPopulado(id: string) {
  return Agendamento.findById(id)
    .populate("paciente", "nome dosagem_hormonio bloqueador_hormonal terapia_hormonal")
    .populate("profissional", "nome cargo")
    .lean();
}

export async function verificarConflitoHorario(
  profissionalId: string,
  data: string,
  hora: string,
  excludeId?: string
) {
  const query: Record<string, unknown> = {
    profissional: profissionalId,
    data,
    hora,
    status: { $ne: "cancelado" },
  };
  if (excludeId) query._id = { $ne: excludeId };

  const existente = await Agendamento.findOne(query).lean();
  return Boolean(existente);
}

export async function getNomeUsuario(usuarioId: string) {
  const user = await User.findById(usuarioId).select("nome").lean();
  return user?.nome ? String(user.nome) : "Sistema";
}

export const ESPECIALIDADE_CARGO: Record<string, string[]> = {
  clinico: ["clínico", "clinico", "geral"],
  psicologia: ["psicolog", "psicólog"],
  hormonal: ["endocrin", "hormon"],
  nutricao: ["nutric"],
};
