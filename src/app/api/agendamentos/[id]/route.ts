import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Agendamento from "@/models/Agendamento";
import {
  serializeAgendamento,
  normalizeStatus,
  findAgendamentoPopulado,
  buscarConflitoHorario,
  montarMensagemConflitoHorario,
  getNomeUsuario,
  normalizarHora,
  normalizarDataIso,
} from "@/lib/agendamentos";

function respostaConflitoHorario(
  conflito: NonNullable<Awaited<ReturnType<typeof buscarConflitoHorario>>>,
  tipoUsuario: string
) {
  return Response.json(
    {
      error: montarMensagemConflitoHorario(conflito, {
        omitirNomePaciente: tipoUsuario === "paciente",
      }),
      code: "CONFLITO_HORARIO",
      conflito,
    },
    { status: 409 }
  );
}

async function getAgendamentoAutorizado(id: string, userId: string, tipo: string) {
  const agendamento = await findAgendamentoPopulado(id);
  if (!agendamento) return { error: "Agendamento não encontrado", status: 404 };

  if (tipo === "paciente") {
    const paciente = agendamento.paciente as { _id?: { toString: () => string } };
    if (paciente?._id?.toString() !== userId) {
      return { error: "Acesso negado", status: 403 };
    }
  }

  return { agendamento };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const result = await getAgendamentoAutorizado(
      id,
      loggedUser.id,
      loggedUser.tipo
    );

    if ("error" in result) {
      return Response.json({ error: result.error }, { status: result.status });
    }

    return Response.json(
      serializeAgendamento(result.agendamento as Record<string, unknown>),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (loggedUser.tipo === "paciente") {
      const authResult = await getAgendamentoAutorizado(
        id,
        loggedUser.id,
        "paciente"
      );
      if ("error" in authResult) {
        return Response.json(
          { error: authResult.error },
          { status: authResult.status }
        );
      }

      const agendamento = await Agendamento.findById(id);
      if (!agendamento) {
        return Response.json(
          { error: "Agendamento não encontrado" },
          { status: 404 }
        );
      }

      if (["cancelado", "realizado", "ausente"].includes(agendamento.status)) {
        return Response.json(
          { error: "Este agendamento não pode mais ser alterado" },
          { status: 400 }
        );
      }

      const usuarioNome = await getNomeUsuario(loggedUser.id);
      const historico = [...(agendamento.historico || [])];

      if (body.status !== undefined) {
        const novoStatus = normalizeStatus(body.status);
        if (novoStatus !== "cancelado") {
          return Response.json(
            { error: "Paciente só pode cancelar o agendamento" },
            { status: 400 }
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
          return Response.json(
            { error: "Informe a nova data ou horário" },
            { status: 400 }
          );
        }

        const dataAntiga = agendamento.data;
        const horaAntiga = agendamento.hora;

        if (body.data !== undefined) {
          agendamento.data = normalizarDataIso(body.data);
        }
        if (body.hora !== undefined) {
          agendamento.hora = normalizarHora(body.hora);
        }

        historico.push({
          acao: `Remarcado de ${dataAntiga} ${horaAntiga} para ${agendamento.data} ${agendamento.hora}`,
          usuarioId: loggedUser.id,
          usuarioNome,
          data: new Date(),
        });
      }

      const profissionalId = String(agendamento.profissional);
      const conflito = await buscarConflitoHorario(
        profissionalId,
        agendamento.data,
        agendamento.hora,
        id
      );
      if (conflito && agendamento.status !== "cancelado") {
        return respostaConflitoHorario(conflito, loggedUser.tipo);
      }

      agendamento.historico = historico;
      await agendamento.save();

      const populado = await findAgendamentoPopulado(id);
      return Response.json(
        serializeAgendamento(populado as Record<string, unknown>),
        { status: 200 }
      );
    }

    if (loggedUser.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const agendamento = await Agendamento.findById(id);
    if (!agendamento) {
      return Response.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    const usuarioNome = await getNomeUsuario(loggedUser.id);
    const historico = [...(agendamento.historico || [])];

    if (body.data !== undefined) agendamento.data = normalizarDataIso(body.data);
    if (body.hora !== undefined) agendamento.hora = normalizarHora(body.hora);
    if (body.observacoes !== undefined) agendamento.observacoes = body.observacoes;
    if (body.tipo !== undefined) agendamento.tipo = body.tipo;
    if (body.modalidade !== undefined) {
      agendamento.modalidade =
        body.modalidade === "Online" ? "Online" : "Presencial";
    }

    if (body.status !== undefined) {
      const novoStatus = normalizeStatus(body.status);
      if (!novoStatus) {
        return Response.json({ error: "Status inválido" }, { status: 400 });
      }

      if (novoStatus !== agendamento.status) {
        const labels: Record<string, string> = {
          confirmado: "Confirmado",
          pendente: "Pendente",
          cancelado: "Cancelado",
          realizado: "Check-in realizado",
          ausente: "Marcado como ausente",
        };
        historico.push({
          acao: `Status alterado para ${labels[novoStatus] || novoStatus}`,
          usuarioId: loggedUser.id,
          usuarioNome,
          data: new Date(),
        });
        agendamento.status = novoStatus;
      }
    }

    const profissionalId = String(agendamento.profissional);
    const conflito = await buscarConflitoHorario(
      profissionalId,
      agendamento.data,
      agendamento.hora,
      id
    );
    if (conflito && agendamento.status !== "cancelado") {
      return respostaConflitoHorario(conflito, loggedUser.tipo);
    }

    agendamento.historico = historico;
    await agendamento.save();

    const populado = await findAgendamentoPopulado(id);
    return Response.json(
      serializeAgendamento(populado as Record<string, unknown>),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}
