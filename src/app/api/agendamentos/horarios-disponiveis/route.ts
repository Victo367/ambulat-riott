import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { listarHorariosDisponiveis } from "@/lib/agendamentos";
import { HORARIOS_AGENDA, normalizarDataIso } from "@/lib/agendamentos-utils";

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
      return Response.json(
        { error: "Informe profissionalId e data" },
        { status: 400 }
      );
    }

    const data = normalizarDataIso(dataParam);
    const disponiveis = await listarHorariosDisponiveis(
      profissionalId,
      data,
      excludeId
    );

    return Response.json({
      data,
      profissionalId,
      disponiveis,
      todos: [...HORARIOS_AGENDA],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}
