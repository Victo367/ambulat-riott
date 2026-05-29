import Agendamento from "@/models/Agendamento";
import {
  serializeAgendamento,
  normalizeStatus,
  findAgendamentoPopulado,
  getNomeUsuario,
  normalizarHora,
  normalizarDataIso,
} from "@/lib/agendamentos";
import { AgendamentoDomainError } from "@/lib/agendamento/errors";
import type { AgendamentoUpdateStrategy, UpdateContext } from "./types";

const STATUS_LABELS: Record<string, string> = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  cancelado: "Cancelado",
  realizado: "Check-in realizado",
  ausente: "Marcado como ausente",
};

export class FuncionarioUpdateStrategy implements AgendamentoUpdateStrategy {
  async execute(ctx: UpdateContext): Promise<Record<string, unknown>> {
    const { id, body, loggedUser } = ctx;

    const agendamento = await Agendamento.findById(id);
    if (!agendamento) {
      throw new AgendamentoDomainError(404, "Agendamento não encontrado");
    }

    const usuarioNome = await getNomeUsuario(loggedUser.id);
    const historico = [...(agendamento.historico || [])];

    if (body.data !== undefined) {
      agendamento.data = normalizarDataIso(String(body.data));
    }
    if (body.hora !== undefined) {
      agendamento.hora = normalizarHora(String(body.hora));
    }
    if (body.observacoes !== undefined) {
      agendamento.observacoes = String(body.observacoes);
    }
    if (body.tipo !== undefined) {
      agendamento.tipo = String(body.tipo);
    }
    if (body.modalidade !== undefined) {
      agendamento.modalidade =
        body.modalidade === "Online" ? "Online" : "Presencial";
    }

    if (body.status !== undefined) {
      const novoStatus = normalizeStatus(body.status);
      if (!novoStatus) {
        throw new AgendamentoDomainError(400, "Status inválido");
      }

      if (novoStatus !== agendamento.status) {
        historico.push({
          acao: `Status alterado para ${STATUS_LABELS[novoStatus] || novoStatus}`,
          usuarioId: loggedUser.id,
          usuarioNome,
          data: new Date(),
        });
        agendamento.status = novoStatus;
      }
    }

    agendamento.historico = historico;
    await agendamento.save();

    const populado = await findAgendamentoPopulado(id);
    return serializeAgendamento(populado as Record<string, unknown>);
  }
}
