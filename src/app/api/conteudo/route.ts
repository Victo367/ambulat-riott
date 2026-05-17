import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Conteudo from "@/models/Conteudo";
import { serializeConteudo } from "@/lib/conteudo-utils";
import {
  ensureConteudoPadrao,
  gerarSlugUnico,
  ordenarConteudoHome,
  salvarImagemConteudo,
} from "@/lib/conteudo-server";

export async function GET() {
  try {
    await connectDB();
    await ensureConteudoPadrao();

    const itens = await Conteudo.find().lean();

    return Response.json(ordenarConteudoHome(itens as Record<string, unknown>[]), {
      status: 200,
    });
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
    if (loggedUser.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const formData = await req.formData();
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const imageFile = formData.get("image");

    if (!title || !description || !content) {
      return Response.json(
        { error: "Título, resumo e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    const slug = await gerarSlugUnico(title);
    let image = "";

    if (
      imageFile &&
      typeof imageFile === "object" &&
      "arrayBuffer" in imageFile &&
      imageFile.size > 0
    ) {
      image = await salvarImagemConteudo(imageFile, slug);
    }

    const criado = await Conteudo.create({
      title,
      description,
      content,
      image,
      slug,
    });

    return Response.json(
      serializeConteudo(criado.toObject() as Record<string, unknown>),
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}
