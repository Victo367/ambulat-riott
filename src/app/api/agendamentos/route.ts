import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Agendamento from "@/models/Agendamento";
import Paciente from "@/models/Paciente";
import Funcionario from "@/models/Funcionario";
import {
  serializeAgendamento,
  normalizeStatus,
  hojeIso,
  normalizarHora,
  normalizarDataIso,
  getNomeUsuario,
} from "@/lib/agendamentos";

export async function GET(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const verTodos = searchParams.get("todos") === "1";
    const dataParam = searchParams.get("data");

    const filter: Record<string, unknown> = {};

    if (!verTodos) {
      const data = dataParam ? normalizarDataIso(dataParam) : hojeIso();
      filter.data = data;
    }

    if (loggedUser.tipo === "paciente") {
      filter.paciente = loggedUser.id;
    }

    const agendamentos = await Agendamento.find(filter)
      .populate("paciente", "nome dosagem_hormonio bloqueador_hormonal")
      .populate("profissional", "nome cargo")
      .sort(verTodos ? { data: 1, hora: 1 } : { hora: 1 })
      .lean();

    return Response.json(
      agendamentos.map((item) => serializeAgendamento(item as Record<string, unknown>)),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const usuarioNome = await getNomeUsuario(loggedUser.id);

    let pacienteId = body.pacienteId as string | undefined;
    const profissionalId = body.profissionalId as string | undefined;
    const data = body.data
      ? normalizarDataIso(body.data as string)
      : undefined;
    const hora = body.hora ? normalizarHora(body.hora as string) : undefined;
    const observacoes = (body.observacoes as string) || "";
    const tipo = (body.tipo as string) || "Consulta";
    const especialidade = (body.especialidade as string) || "";
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
      return Response.json(
        {
          error: "Preencha os campos obrigatórios indicados",
          fields,
        },
        { status: 400 }
      );
    }

    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) {
      return Response.json(
        {
          error: "Paciente não encontrado",
          fields: { pacienteId: "Paciente não encontrado" },
        },
        { status: 404 }
      );
    }

    const profissional = await Funcionario.findById(profissionalId);
    if (!profissional) {
      return Response.json(
        {
          error: "Profissional não encontrado",
          fields: { profissionalId: "Profissional não encontrado" },
        },
        { status: 404 }
      );
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

    return Response.json(
      serializeAgendamento(populado as Record<string, unknown>),
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}
