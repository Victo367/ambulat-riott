import { connectDB } from "@/lib/db";
import ConteudoImagem from "@/models/ConteudoImagem";
import mongoose from "mongoose";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response("Imagem não encontrada", { status: 404 });
    }

    await connectDB();

    const imagem = await ConteudoImagem.findById(id).select("data contentType");

    if (!imagem?.data?.length) {
      return new Response("Imagem não encontrada", { status: 404 });
    }

    return new Response(imagem.data, {
      status: 200,
      headers: {
        "Content-Type": imagem.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Erro ao carregar imagem", { status: 500 });
  }
}
