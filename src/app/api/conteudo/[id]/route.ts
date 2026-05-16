import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Conteudo from "@/models/Conteudo";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (loggedUser.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;
    const removido = await Conteudo.findByIdAndDelete(id);

    if (!removido) {
      return Response.json({ error: "Artigo não encontrado" }, { status: 404 });
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}
