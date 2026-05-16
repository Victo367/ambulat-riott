import { connectDB } from "@/lib/db";
import Conteudo from "@/models/Conteudo";
import { serializeConteudo } from "@/lib/conteudo-utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

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
