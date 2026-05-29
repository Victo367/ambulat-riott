import Agendamento from "@/models/Agendamento";
import Paciente from "@/models/Paciente";
import Funcionario from "@/models/Funcionario";
import type { TokenPayload } from "@/lib/auth";
import {
  serializeAgendamento,
  normalizeStatus,
  hojeIso,
  normalizarHora,
  normalizarDataIso,
  getNomeUsuario,
  listarHorariosDisponiveis,
} from "@/lib/agendamentos";
import { HORARIOS_AGENDA } from "@/lib/agendamentos-utils";
import { obterAgendamentoAutorizado } from "@/lib/agendamento/access";
import { AgendamentoDomainError } from "@/lib/agendamento/errors";
import { resolveUpdateStrategy } from "@/lib/agendamento-update-strategies/resolve-strategy";

export class AgendamentoFacade {
  async obterAutorizado(id: string, loggedUser: TokenPayload) {
    const result = await obterAgendamentoAutorizado(
      id,
      loggedUser.id,
      loggedUser.tipo
    );
    if ("error" in result) {
      throw new AgendamentoDomainError(result.status, result.error);
    }
    return serializeAgendamento(
      result.agendamento as Record<string, unknown>
    );
  }

  async listar(
    loggedUser: TokenPayload,
    opcoes: { verTodos: boolean; dataParam?: string | null }
  ) {
    const filter: Record<string, unknown> = {};

    if (!opcoes.verTodos) {
      const data = opcoes.dataParam
        ? normalizarDataIso(opcoes.dataParam)
        : hojeIso();
      filter.data = data;
    }

    if (loggedUser.tipo === "paciente") {
      filter.paciente = loggedUser.id;
    }

    const agendamentos = await Agendamento.find(filter)
      .populate("paciente", "nome dosagem_hormonio bloqueador_hormonal")
      .populate("profissional", "nome cargo")
      .sort(opcoes.verTodos ? { data: 1, hora: 1 } : { hora: 1 })
      .lean();

    return agendamentos.map((item) =>
      serializeAgendamento(item as Record<string, unknown>)
    );
  }

  async criar(loggedUser: TokenPayload, body: Record<string, unknown>) {
    const usuarioNome = await getNomeUsuario(loggedUser.id);

    let pacienteId = body.pacienteId as string | undefined;
    const profissionalId = body.profissionalId as string | undefined;
    const data = body.data
      ? normalizarDataIso(String(body.data))
      : undefined;
    const hora = body.hora ? normalizarHora(String(body.hora)) : undefined;
    const observacoes = String(body.observacoes ?? "");
    const tipo = String(body.tipo ?? "Consulta");
    const especialidade = String(body.especialidade ?? "");
    const modalidade = body.modalidade === "Online" ? "Online" : "Presencial";
    const status = normalizeStatus(body.status) || "pendente";

    if (loggedUser.tipo === "paciente") {
      pacienteId = loggedUser.id;
    }

    const fields: Record<string, string> = {};
    if (!pacienteId) fields.pacienteId = "Selecione o paciente";
    if (!profissionalId) fields.profissionalId = "Selecione o profissional";
    if (!data) fields.data = "Informe a data da consulta";
    if (!hora) fields.hora = "Selecione um horário disponível";
    if (loggedUser.tipo === "paciente" && !body.especialidade) {
      fields.especialidade = "Selecione a especialidade";
    }

    if (Object.keys(fields).length > 0) {
      throw new AgendamentoDomainError(
        400,
        "Preencha os campos obrigatórios indicados",
        fields
      );
    }

    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) {
      throw new AgendamentoDomainError(404, "Paciente não encontrado", {
        pacienteId: "Paciente não encontrado",
      });
    }

    const profissional = await Funcionario.findById(profissionalId);
    if (!profissional) {
      throw new AgendamentoDomainError(404, "Profissional não encontrado", {
        profissionalId: "Profissional não encontrado",
      });
    }

    const agendamento = await Agendamento.create({
      paciente: pacienteId,
      profissional: profissionalId,
      data,
      hora,
      tipo,
      especialidade,
      status,
      modalidade,
      observacoes,
      criadoPor: loggedUser.id,
      historico: [
        {
          acao: "Agendamento criado",
          usuarioId: loggedUser.id,
          usuarioNome,
        },
      ],
    });

    const populado = await Agendamento.findById(agendamento._id)
      .populate("paciente", "nome dosagem_hormonio bloqueador_hormonal")
      .populate("profissional", "nome cargo")
      .lean();

    return serializeAgendamento(populado as Record<string, unknown>);
  }

  async atualizar(
    id: string,
    body: Record<string, unknown>,
    loggedUser: TokenPayload
  ) {
    const strategy = resolveUpdateStrategy(loggedUser.tipo);
    return strategy.execute({ id, body, loggedUser });
  }

  async horariosDisponiveis(
    profissionalId: string,
    data: string,
    excludeId?: string
  ) {
    const dataIso = normalizarDataIso(data);
    const disponiveis = await listarHorariosDisponiveis(
      profissionalId,
      dataIso,
      excludeId
    );

    return {
      data: dataIso,
      profissionalId,
      disponiveis,
      todos: [...HORARIOS_AGENDA],
    };
  }
}

export const agendamentoFacade = new AgendamentoFacade();
