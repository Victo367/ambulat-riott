import { connectDB } from "@/lib/db";
import Conteudo from "@/models/Conteudo";
import { serializeConteudo } from "@/lib/conteudo-utils";
import { ensureConteudoPadrao } from "@/lib/conteudo-server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    await ensureConteudoPadrao();

    const { slug } = await params;
    const item = await Conteudo.findOne({ slug }).lean();

    if (!item) {
      return Response.json({ error: "Artigo não encontrado" }, { status: 404 });
    }

    return Response.json(
      serializeConteudo(item as Record<string, unknown>),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}
