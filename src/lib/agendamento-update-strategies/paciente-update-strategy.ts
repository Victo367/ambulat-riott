import Agendamento from "@/models/Agendamento";
import {
  serializeAgendamento,
  normalizeStatus,
  findAgendamentoPopulado,
  getNomeUsuario,
  normalizarHora,
  normalizarDataIso,
} from "@/lib/agendamentos";
import { obterAgendamentoAutorizado } from "@/lib/agendamento/access";
import { AgendamentoDomainError } from "@/lib/agendamento/errors";
import type { AgendamentoUpdateStrategy, UpdateContext } from "./types";

export class PacienteUpdateStrategy implements AgendamentoUpdateStrategy {
  async execute(ctx: UpdateContext): Promise<Record<string, unknown>> {
    const { id, body, loggedUser } = ctx;

    const authResult = await obterAgendamentoAutorizado(
      id,
      loggedUser.id,
      "paciente"
    );
    if ("error" in authResult) {
      throw new AgendamentoDomainError(authResult.status, authResult.error);
    }

    const agendamento = await Agendamento.findById(id);
    if (!agendamento) {
      throw new AgendamentoDomainError(404, "Agendamento não encontrado");
    }

    if (["cancelado", "realizado", "ausente"].includes(agendamento.status)) {
      throw new AgendamentoDomainError(
        400,
        "Este agendamento não pode mais ser alterado"
      );
    }

    const usuarioNome = await getNomeUsuario(loggedUser.id);
    const historico = [...(agendamento.historico || [])];

    if (body.status !== undefined) {
      const novoStatus = normalizeStatus(body.status);
      if (novoStatus !== "cancelado") {
        throw new AgendamentoDomainError(
          400,
          "Paciente só pode cancelar o agendamento"
        );
      }
      if (novoStatus !== agendamento.status) {
        historico.push({
          acao: "Consulta cancelada pelo paciente",
          usuarioId: loggedUser.id,
          usuarioNome,
          data: new Date(),
        });
        agendamento.status = novoStatus;
      }
    } else {
      if (body.data === undefined && body.hora === undefined) {
        throw new AgendamentoDomainError(
          400,
          "Informe a nova data ou horário",
          {
            data: "Selecione a nova data",
            hora: "Selecione o novo horário",
          }
        );
      }

      const dataAntiga = agendamento.data;
      const horaAntiga = agendamento.hora;

      if (body.data !== undefined) {
        agendamento.data = normalizarDataIso(String(body.data));
      }
      if (body.hora !== undefined) {
        agendamento.hora = normalizarHora(String(body.hora));
      }

      historico.push({
        acao: `Remarcado de ${dataAntiga} ${horaAntiga} para ${agendamento.data} ${agendamento.hora}`,
        usuarioId: loggedUser.id,
        usuarioNome,
        data: new Date(),
      });
    }

    agendamento.historico = historico;
    await agendamento.save();

    const populado = await findAgendamentoPopulado(id);
    return serializeAgendamento(populado as Record<string, unknown>);
  }
}
