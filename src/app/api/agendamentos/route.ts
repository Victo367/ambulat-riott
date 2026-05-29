import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { agendamentoFacade } from "@/lib/agendamento-facade";
import { agendamentoErrorResponse } from "@/lib/agendamento/http-response";

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

    const dados = await agendamentoFacade.listar(loggedUser, {
      verTodos,
      dataParam,
    });

    return Response.json(dados, { status: 200 });
  } catch (error: unknown) {
    return agendamentoErrorResponse(error);
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
    const criado = await agendamentoFacade.criar(loggedUser, body);

    return Response.json(criado, { status: 201 });
  } catch (error: unknown) {
    return agendamentoErrorResponse(error);
  }
}
