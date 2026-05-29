import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { agendamentoFacade } from "@/lib/agendamento-facade";
import { agendamentoErrorResponse } from "@/lib/agendamento/http-response";
import { AgendamentoDomainError } from "@/lib/agendamento/errors";

export async function GET(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const profissionalId = searchParams.get("profissionalId")?.trim();
    const dataParam = searchParams.get("data")?.trim();
    const excludeId = searchParams.get("excludeId")?.trim() || undefined;

    if (!profissionalId || !dataParam) {
      throw new AgendamentoDomainError(
        400,
        "Informe profissionalId e data"
      );
    }

    const resultado = await agendamentoFacade.horariosDisponiveis(
      profissionalId,
      dataParam,
      excludeId
    );

    return Response.json(resultado, { status: 200 });
  } catch (error: unknown) {
    return agendamentoErrorResponse(error);
  }
}
