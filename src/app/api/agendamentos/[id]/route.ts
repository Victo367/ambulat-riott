import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { agendamentoFacade } from "@/lib/agendamento-facade";
'import { agendamentoErrorResponse } from "@/lib/agendamento/http-response";

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
    const data = await agendamentoFacade.obterAutorizado(id, loggedUser);

    return Response.json(data, { status: 200 });
  } catch (error: unknown) {
    return agendamentoErrorResponse(error);
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

    const atualizado = await agendamentoFacade.atualizar(id, body, loggedUser);

    return Response.json(atualizado, { status: 200 });
  } catch (error: unknown) {
    return agendamentoErrorResponse(error);
  }
}
