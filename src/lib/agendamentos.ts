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

export type { ConflitoHorarioDetalhes } from "@/lib/agendamentos-utils";
export { montarMensagemConflitoHorario } from "@/lib/agendamentos-utils";

export async function buscarConflitoHorario(
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

  const existente = await Agendamento.findOne(query)
    .populate("paciente", "nome")
    .populate("profissional", "nome cargo")
    .lean();

  if (!existente) return null;

  const paciente = existente.paciente as { nome?: string } | null;
  const profissional = existente.profissional as {
    nome?: string;
    cargo?: string;
  } | null;

  const profissionalNome = profissional?.nome
    ? profissional.cargo
      ? `${profissional.nome} (${profissional.cargo})`
      : String(profissional.nome)
    : "o profissional selecionado";

  return {
    data: String(existente.data),
    hora: String(existente.hora),
    profissionalNome,
    pacienteNome: paciente?.nome ? String(paciente.nome) : "outro paciente",
    status: String(existente.status),
  };
}

export async function verificarConflitoHorario(
  profissionalId: string,
  data: string,
  hora: string,
  excludeId?: string
) {
  const conflito = await buscarConflitoHorario(
    profissionalId,
    data,
    hora,
    excludeId
  );
  return Boolean(conflito);
}

export async function getNomeUsuario(usuarioId: string) {
  const user = await User.findById(usuarioId).select("nome").lean();
  return user?.nome ? String(user.nome) : "Sistema";
}
