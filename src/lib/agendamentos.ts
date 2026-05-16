import Agendamento from "@/models/Agendamento";
import User from "@/models/User";

export {
  STATUS_VALUES,
  type StatusAgendamento,
  formatStatusLabel,
  normalizeStatus,
  formatDataExibicao,
  hojeIso,
  normalizarHora,
  normalizarDataIso,
  serializeAgendamento,
  ESPECIALIDADE_CARGO,
  ESPECIALIDADE_LABELS,
  labelEspecialidade,
  dataAgendamentoParaDate,
  formatDataCurta,
  formatDiaSemana,
  partesDataCard,
} from "@/lib/agendamentos-utils";

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
